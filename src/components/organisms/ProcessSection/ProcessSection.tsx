import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './ProcessSection.css';

const processSteps = [
  {
    img: "/assets/img/1.png",
    title: "1. Análisis de Referencias",
    description: "Estudio detallado de las fotos proporcionadas desde múltiples ángulos.",
  },
  {
    img: "/assets/img/2.png",
    title: "2. Modelado 3D Profesional",
    description: "Creación del modelo usando Blender y Shapr3D según complejidad.",
  },
  {
    img: "/assets/img/3.png",
    title: "3. Software Paramétrico",
    description: "Ajustes precisos de dimensiones y proporciones con herramientas paramétricas.",
  },
  {
    img: "/assets/img/4.png",
    title: "4. Evaluación de Complejidad",
    description: "Análisis técnico para determinar segmentación y soporte óptimos.",
  },
  {
    img: "/assets/img/5.png",
    title: "5. Optimización para Impresión",
    description: "Preparación del archivo con orientación y soportes ideales.",
  },
  {
    img: "/assets/img/6.png",
    title: "6. Impresión en Elegoo Saturn 4 Ultra 16K",
    description: "Impresión en alta resolución de última generación.",
  },
  {
    img: "/assets/img/7.png",
    title: "7. Postprocesado en Anycubic Wash & Cure 3 Plus",
    description: "Limpieza con IPA y curado UV controlado para máxima resistencia.",
  },
  {
    img: "/assets/img/8.png",
    title: "8. Acabado Final",
    description: "Pintado artístico a mano con técnicas y pulso profesionales.",
  },
];

const ProcessSection: React.FC = () => {
  return (
    <section id="proceso" className="seccion">
      <h2>El proceso explicado en 8 pasos!
      </h2>
      <Container>
        <Row>
          {processSteps.map((step, index) => (
            <Col key={index} xs={12} md={3} className="mb-4">
              <div className="step-card">
                <img src={step.img} className="card-img-top" alt={step.title} />
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ProcessSection;