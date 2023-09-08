import { Request, Response } from 'express';

import { generateJWT } from '../helpers/jwt';
import fileSave from '../helpers/fileSave';
import bcrypt from 'bcryptjs';
import fileDelete from '../helpers/fileDelete';
import Usuario from '../model/Usario';


export const getUsers = async (req: Request, res: Response) => {

    const usuarios = await Usuario.findAll();

    const folderName = process.env.FOLDER_NAME || 'imagenes';
    // url de imagen
    const url = `${req.protocol}://${req.get('host')}/${folderName}/`;

    const usuariosConImagen = usuarios.map(user => {
        delete user.dataValues.password;
        const nuevaImagen = url + user.dataValues.imagen;
        const dataUser = {
            ...user,
            dataValues: {
                ...user.dataValues,
                imagen: nuevaImagen
            }
        }
        return dataUser.dataValues;
    })

    return res.json({
        status: 'success',
        message: 'Lista de usuarios',
        data: usuariosConImagen,
    });
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await Usuario.findByPk(id);
    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: 'No existe el usuario'
        });
    }

    const folderName = process.env.FOLDER_NAME || 'imagenes';
    // url de imagen
    const url = `${req.protocol}://${req.get('host')}/${folderName}/`;
    user.dataValues.imagen = url + user.dataValues.imagen;

    delete user.dataValues.password;

    return res.json({
        status: 'success',
        message: 'Usuario encontrado',
        data: user
    })
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { body } = req;

        //buscar si el email existe
        // const comprobar = await User.where('email', body.email).first();
        const comprobar = await Usuario.findOne({ where: { email: body.email } });

        //si existe
        if (comprobar) {
            return res.status(400).json({
                status: 'error',
                message: 'El email ya existe'
            });
        }

        const images = req.files;
        const result = fileSave({ file: images!, fieldName: ['imagen'] });

        if ('error' in result) return res.status(400).json({
            status: 'error',
            message: 'Error al guardar imagen',
            data: result.error
        });

        const { imagen } = result.nameFiles;
        //agregar imagen a body
        body.imagen = imagen;

        //encriptar password
        const salt = bcrypt.genSaltSync();
        body.password = bcrypt.hashSync(body.password, salt);

        //guardar usuario
        const usuario = await Usuario.create(body);
        delete usuario.dataValues.password;

        //generar el token
        const token = await generateJWT({ uid: usuario.dataValues.id, email: usuario.dataValues.email });

        //url de imagen
        const url = `${req.protocol}://${req.get('host')}/${process.env.FOLDER_NAME || 'imagenes'}/`;
        usuario.dataValues.imagen = url + usuario.dataValues.imagen;

        return res.json({
            status: 'success',
            message: 'Usuario creado correctamente',
            data: usuario,
            token
        });
    } catch (error) {
        if (error instanceof Error) {
            // Si el error es una instancia de la clase Error, entonces sabemos que es un objeto de error válido.
            return res.status(500).json({
                status: 'error',
                message: 'Error en el servidor',
                error: error.message
            });
        } else {
            // Si el error no es una instancia de Error, puedes manejarlo de otra manera o simplemente devolver un mensaje genérico.
            return res.status(500).json({
                status: 'error',
                message: 'Error en el servidor',
                error: 'Error desconocido'
            });
        }
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        return res.status(400).json({
            status: 'error',
            message: 'No existe el usuario'
        });
    }

    if (req.files) {
        const result = fileSave({ file: req.files!, fieldName: ['imagen'] });
        if ('error' in result) return res.status(400).json(result);
        const { imagen } = result.nameFiles;

        // eliminar la imagen anterior
        fileDelete(usuario.dataValues.imagen);

        //agregar imagen a body
        body.imagen = imagen;
    }

    if (body.password) {
        //encriptar password
        const salt = bcrypt.genSaltSync();
        body.password = bcrypt.hashSync(body.password, salt);
    }
    console.log(body);

    //actualizar usuario
    const userUpdate = await usuario.update(body);

    //url de imagen
    const url = `${req.protocol}://${req.get('host')}/${process.env.FOLDER_NAME || 'imagenes'}/`;
    userUpdate.dataValues.imagen = url + (req.files ? userUpdate.dataValues.imagen : usuario.dataValues.imagen);
    delete userUpdate.dataValues.password;

    return res.json({
        status: 'success',
        message: 'Usuario actualizado correctamente',
        data: userUpdate
    });
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        return res.status(400).json({
            status: 'error',
            message: 'No existe el usuario'
        });
    }
    // eliminar la imagen
    fileDelete(usuario.dataValues.imagen);
    //eliminar usuario
    await Usuario.destroy({ where: { id }, });
    return res.json({
        status: 'success',
        message: 'Usuario eliminado correctamente',
    })
}

