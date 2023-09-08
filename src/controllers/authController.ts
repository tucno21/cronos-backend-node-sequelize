import { Request, Response } from 'express';
import { generateJWT } from '../helpers/jwt';
import fileSave from '../helpers/fileSave';
import bcrypt from 'bcryptjs';
import Usuario from '../model/Usario';

export const getUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        //verificar si el email existe
        const usuario = await Usuario.findOne({
            where: { email: email },
            // attributes: { exclude: ['password'] }
        });

        //si no existe
        if (!usuario) {
            return res.status(400).json({
                status: 'error',
                message: 'El email no existe'
            });
        }

        // verificar password
        const validarPassword = bcrypt.compareSync(password, usuario.dataValues.password);
        if (!validarPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'La contraseña es incorrecta'
            });
        }

        //generar el token
        const token = await generateJWT({ uid: usuario.dataValues.id, email: usuario.dataValues.email });

        // //elimanar el password del objeto
        usuario.dataValues.password = undefined;

        return res.json({
            status: 'success',
            message: 'Usuario logueado correctamente',
            data: usuario,
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
};

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    // try {
    const { body } = req;

    //buscar si el email existe
    const existe = await Usuario.findOne({ where: { email: body.email } });
    //si existe
    if (existe) {
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

    // guardar usuario
    const usuario = await Usuario.create(body);
    delete usuario.dataValues.password;

    // generar el token
    const token = await generateJWT({ uid: usuario.dataValues.id, email: usuario.dataValues.email });

    return res.json({
        status: 'success',
        message: 'Usuario creado correctamente',
        data: usuario,
        token
    });

    // } catch (error: any) {
    //     return res.status(500).json({
    //         msg: 'Error en el servidor',
    //         error: error.message
    //     });
    // }
}
