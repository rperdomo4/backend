import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Salida from '../models/SalidaModel.js'; 
import DetalleSalida from '../models/DetalleSalidaModel.js';
import sequelize from '../config/db.js';

import Requisicion from '../models/RequisicionModel.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseTextToData(text) {
 
  const cleanedText = text
    .replace(/\r\n/g, '\n')  
    .replace(/\t+/g, '\t')   
    .trim();

  const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line);
  let parsedData = {
    salida: '',
    items: []
  };

  let itemsStarted = false;

  lines.forEach(line => {
    console.log('Processing line:', line); 

    
    const salidaMatch = line.match(/^NO SALIDA:\s*(\S+)/);
    if (salidaMatch) {
      parsedData.salida = salidaMatch[1];
      console.log('Extracted salida:', parsedData.salida); 
    } else if (line.startsWith('CANTIDAD') || line.startsWith('COD. ARTICULO')) {
      itemsStarted = true;
    } else if (itemsStarted) {
      line = line.replace(/,/g, '.'); 

      const parts = line.split('\t').map(part => part.trim()).filter(part => part);
      if (parts.length >= 4) {
        parsedData.items.push({
          cant: parts[0] || '',
          articulo: parts[1] || '',
          descripcion: parts[3] || ''
        });
      }
    }
  });

  console.log('Datos extraídos:', parsedData);

  return parsedData;
}
export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('apikey', process.env.OCR_API_KEY); 
    form.append('language', 'spa');
    form.append('isTable', 'true');
    form.append('scale', 'true');
    form.append('detectOrientation', 'true');
    form.append('isCreateSearchablePDF', 'false');

    const response = await axios.post('https://api.ocr.space/parse/image', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    if (response.data && response.data.ParsedResults && response.data.ParsedResults.length > 0) {
      const text = response.data.ParsedResults[0].ParsedText;
      const parsedData = parseTextToData(text);

      
      fs.unlinkSync(filePath);

     
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      
      const tempFilePath = path.join(tempDir, 'parsedData.json');
      fs.writeFileSync(tempFilePath, JSON.stringify(parsedData));

      res.status(200).json({ message: 'File processed successfully.', data: parsedData });
    } else {
      fs.unlinkSync(filePath);
      res.status(404).send('No text found in the provided PDF.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the file.');
  }
};

export const saveData = async (req, res) => {
  const { data, requisicion, fecha, estado, creada } = req.body;

  console.log('Datos recibidos:', { data, requisicion, fecha, estado, creada });

  if (!data || !requisicion || !data.salida || !fecha || !estado ) {
    return res.status(400).send('Faltan datos requeridos.');
  }

  try {
    const salida = await Salida.create({
      Salida: data.salida,
      NRequisicionFK: requisicion,
      Fecha: fecha,
      Estado:estado,
      CreadaPor:creada
    });

    console.log('Salida guardada:', salida); 
    const detalles = data.items.map(item => ({
      Articulo: item.articulo,
      Descripcion: item.descripcion,
      Cant: item.cant,
      Salida: data.salida,
    }));

    await DetalleSalida.bulkCreate(detalles);

    console.log('Detalles guardados:', detalles);
    const requisicionExistente = await Requisicion.findOne({ where: { NRequisicion: requisicion } });
    if (!requisicionExistente) {
      return res.status(404).send('Requisición no encontrada.');
    }

    const [updated] = await Requisicion.update(
      { EstadoReq: estado },  
      { where: { NRequisicion: requisicion } }  
    );

    if (updated) {
      console.log('Requisición actualizada:', { Estado: estado, NRequisicion: requisicion });
      return res.status(200).send('Datos guardados y actualizados correctamente.');
    } else {
      console.error('No se pudo actualizar la requisición.');
      return res.status(500).send('No se pudo actualizar la requisición.');
    }
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    res.status(500).send('Error al guardar los datos.');
  }
};


export const getSalidasConDetalles = async (req, res) => {
  try {
    const salidas = await Salida.findAll({
      include: [
        {
          model: DetalleSalida,
          as: 'Detalles'
        }
      ],
      attributes: {
        include: [
          [sequelize.fn('FORMAT', sequelize.col('Fecha'), 'dd-MM-yyyy', 'es-ES'), 'Fecha'], // Formatear la fecha
          [sequelize.fn('FORMAT', sequelize.col('FechaRecibido'), 'dd-MM-yyyy', 'es-ES'), 'FechaRecibido']
        ]
      }
    });

    if (salidas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron salidas.' });
    }

    const salidasConBase64 = salidas.map(salida => {
      const salidaJSON = salida.toJSON();
      if (salidaJSON.Firma) {
        salidaJSON.Firma = salidaJSON.Firma.toString('base64');
      }
      if (salidaJSON.Imgs) {
        salidaJSON.Imgs = salidaJSON.Imgs.toString('base64');
      }
      return salidaJSON;
    });

    res.status(200).json(salidasConBase64);
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: `Error al obtener las salidas: ${error.message}` });
  }
};

export const actualizarSalida = async (req, res) => {
  const { salida, repuestos = [],  firma, imgs, recibido, fechaRecibido, estado } = req.body;
  const usuario = req.user; 

  console.log('Usuario en actualizarSalida:', usuario);
  if (!salida) {
    return res.status(400).json({ message: 'El valor de salida es requerido' });
  }
  try {
    const salidaEncontrada = await Salida.findOne({ where: { Salida: salida } });

    if (!salidaEncontrada) {
      return res.status(404).json({ message: 'Salida no encontrada' });
    }
  
    if (repuestos.length > 0) {
      await Promise.all(repuestos.map(async (repuesto) => {
        if (repuesto.ID) {
          const detalle = await DetalleSalida.findByPk(repuesto.ID);

          if (detalle) {
            if (repuesto.CantRecibida ) {
              detalle.CantRecibida = repuesto.CantRecibida;
            }
          
            await detalle.save();
          } else {
            console.warn(`Detalle con ID ${repuesto.ID} no encontrado`);
          }
        }
      }));
    }
    if (firma) {
      const firmaBuffer = base64ToBuffer(firma);
      salidaEncontrada.Firma = firmaBuffer;
    }
  
    if (imgs) {
      const imgsBuffer = base64ToBuffer(imgs);
      salidaEncontrada.Imgs = imgsBuffer;
    }

    salidaEncontrada.Estado = estado;
    salidaEncontrada.RecibidoPor = recibido || usuario?.username || null;
    salidaEncontrada.FechaRecibido = fechaRecibido; 
    await salidaEncontrada.save();
    res.status(200).json({ message: 'Detalles actualizados exitosamente' });
  } catch (error) {
    console.error('Error al actualizar los detalles:', error);
    res.status(500).json({ message: `Error al actualizar los detalles: ${error.message}` });
  }
};

const base64ToBuffer = (data) => {
  return Buffer.from(data, 'base64');
};