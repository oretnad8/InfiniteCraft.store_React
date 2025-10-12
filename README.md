# 🛍️ InfiniteCraft.store - React con TypeScript

## 📋 Información del Proyecto
- **Asignatura:** DSY1104 - Desarrollo Fullstack II
- **Evaluación:** Parcial N°2
- **Estudiante:** Dante Rojas Olmedo
- **Fecha:** Octubre 2025

Este proyecto es una migración y mejora de la Evaluación 1 de la asignatura Fullstack II (DSY1104), adaptada a los contenidos de la Experiencia de Aprendizaje 2. La aplicación web original ha sido reconstruida utilizando React con TypeScript y Vite como un moderno sistema de empaquetado y construcción, aprovechando SWC para una compilación ultrarrápida.

## Descripción 

InfiniteCraft.store es una tienda en línea simulada, especializada en la venta de figuras personalizadas impresas en resina 3D. Los usuarios pueden explorar diferentes productos, agregarlos a un carrito de compras, registrarse, iniciar sesión y contactar con la tienda.

## Características Técnicas
El desarrollo de este proyecto se centra en la aplicación de conceptos modernos de desarrollo frontend, entre los que destacan:

## ⚛️ React y TypeScript
Toda la base del código está construida sobre React, utilizando TypeScript para añadir tipado estático, lo que mejora la robustez, facilita el mantenimiento y previene errores comunes durante el desarrollo.

## 🔬 Atomic Design
La arquitectura de los componentes sigue la metodología de Atomic Design, organizando la interfaz de usuario en una jerarquía de componentes reutilizables y componibles:

**Atoms:** Los bloques de construcción más básicos, como Button, Input y Logo.

**Molecules:** Combinaciones de átomos que forman componentes más complejos, como FormField y ProductCard.

**Organisms:** Estructuras más elaboradas que agrupan moléculas, como ProductGrid, LoginForm y el Header.

**Templates:** Esqueletos de página que definen la disposición de los organismos.

**Pages:** Instancias concretas de las plantillas con contenido real.

## Custom Hook: useForm
Para gestionar el estado y la lógica de los formularios de manera eficiente y reutilizable, se ha creado el hook personalizado useForm. Este hook encapsula el manejo del estado con useState, proveyendo una interfaz sencilla para controlar los valores de los campos (values), así como los manejadores de eventos handleChange y handleSubmit.

'''
TypeScript

// src/hooks/useForm.ts
import { useState } from 'react';
import type { ChangeEvent } from 'react';

const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, callback: () => void) => {
    e.preventDefault();
    callback();
  };

  return {
    values,
    handleChange,
    handleSubmit,
  };
};

export default useForm;
'''
## Cómo ejecutar el proyecto

Clona el repositorio.

Instala las dependencias con npm install.

Ejecuta el servidor de desarrollo con npm run dev.

Abre http://localhost:5173 en tu navegador para ver la aplicación.