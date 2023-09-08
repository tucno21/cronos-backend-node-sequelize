import { Request, Response } from 'express';
import BlogEtiqueta from '../model/BlogEtiqueta';
import Etiqueta from '../model/Etiqueta';
import Blog from '../model/Blog';
import Usuario from '../model/Usario';


export const getBlogs = async (_req: Request, res: Response) => {
    try {
        // const blogs = await Blog.findAll()
        const blogs = await Blog.findAll({
            include: [
                {
                    model: Etiqueta, // Modelo a incluir
                    attributes: ['id', 'nombre'], // Especifica los campos que deseas seleccionar
                    through: { attributes: [] }, // Excluye los datos de la tabla intermedia blog_etiqueta
                },
                {
                    model: Usuario, // Modelo de autor
                    attributes: ['nombre', 'email', 'imagen'], // Especifica los campos que deseas seleccionar del autor
                    as: 'autor', // Nombre del modelo de relación
                },
            ],
        });


        return res.json({
            status: 'success',
            message: 'Blogs encontrados',
            data: blogs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
}

export const getBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByPk(id, {
            include: [
                {
                    model: Etiqueta, // Modelo a incluir
                    attributes: ['id', 'nombre'], // Especifica los campos que deseas seleccionar
                    through: { attributes: [] }, // Excluye los datos de la tabla intermedia blog_etiqueta
                },
            ],
        });

        return res.json({
            status: 'success',
            message: 'Blog encontrado',
            data: blog
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
}

export const createBlog = async (req: Request, res: Response) => {
    try {
        const { titulo, contenido, usuario_id, etiquetas } = req.body;

        // Crea el blog
        const nuevoBlog = await Blog.create({
            titulo,
            contenido,
            usuario_id,
        });

        const blogId = nuevoBlog.dataValues.id;

        // // etiquetaIds es un arreglo de los IDs de las etiquetas relacionadas con el blog
        // await Promise.all(etiquetas.map(async (etiquetaId: any) => {
        //     await BlogEtiqueta.create({
        //         etiquetaId: etiquetaId,
        //         blogId: blogId,
        //     });
        // }));
        // Asociar etiquetas creando instancias de BlogEtiqueta
        const blogEtiquetas = etiquetas.map((etiqueta: any) => {
            return {
                blogId: blogId,
                etiquetaId: etiqueta
            }
        });
        await BlogEtiqueta.bulkCreate(blogEtiquetas);


        // const blog = await Blog.findByPk(blogId, {
        //     include: Etiqueta, // Incluye las etiquetas asociadas al blog
        // });
        const blog = await Blog.findByPk(blogId, {
            include: [
                {
                    model: Etiqueta, // Modelo a incluir
                    attributes: ['id', 'nombre'], // Especifica los campos que deseas seleccionar
                    through: { attributes: [] }, // Excluye los datos de la tabla intermedia blog_etiqueta
                },
            ],
        });

        return res.json({
            status: 'success',
            message: 'Blog creado',
            data: blog,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
}

export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, contenido, usuario_id, etiquetas } = req.body;

        //paso obtenmos el blog
        const blog = await Blog.findOne({ where: { id }, });

        //si no existe el blog
        if (!blog) return res.status(404).json({ status: 'error', message: 'No existe el Blog' })

        //actualizamos el blog
        await blog.update({ titulo: titulo, contenido: contenido, usuario_id: usuario_id })

        //eliminamos las etiquetas del blog
        await BlogEtiqueta.destroy({ where: { blogId: id } });

        // Asociar etiquetas creando instancias de BlogEtiqueta
        const blogEtiquetas = etiquetas.map((etiqueta: any) => {
            return {
                blogId: id,
                etiquetaId: etiqueta
            }
        });
        await BlogEtiqueta.bulkCreate(blogEtiquetas);

        const datablog = await Blog.findByPk(id, {
            include: [
                {
                    model: Etiqueta, // Modelo a incluir
                    attributes: ['id', 'nombre'], // Especifica los campos que deseas seleccionar
                    through: { attributes: [] }, // Excluye los datos de la tabla intermedia blog_etiqueta
                },
            ],
        });

        return res.json({
            status: 'success',
            message: 'Blog creado',
            data: datablog,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
}

export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const blog = await Blog.destroy({ where: { id }, });
        if (!blog) return res.status(404).json({ status: 'error', message: 'No existe el blog' })
        return res.json({ status: 'success', message: 'Blog eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
}