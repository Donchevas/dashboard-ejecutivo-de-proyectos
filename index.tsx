/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { render, createElement } from 'preact';
import { useState, useEffect, useMemo, useRef } from 'preact/hooks';
import htm from 'htm';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const html = htm.bind(createElement);

// --- TYPES ---
interface Project {
  idClarity: string;
  nombre: string;
  estado: string;
  fase: string;
  avanceReal: number;
  plazo: number;
  responsable: string;
  gestor: string;
  sponsor: string;
  segmentacion: string;
  tipoTrabajo: string;
  fechaInicio: string;
  fechaFinCompromiso: string;
  fechaFinReal: string | null;
  ultimaActualizacion: string;
}

// --- MOCK DATA ---
const projectData: Project[] = [
  // Provided data
  { "idClarity": "PRJ001", "nombre": "Implementación CRM", "estado": "En curso", "fase": "Desarrollo", "avanceReal": 45, "plazo": 50, "responsable": "Ana Torres", "gestor": "Carlos Pérez", "sponsor": "Dirección Comercial", "segmentacion": "Negocio", "tipoTrabajo": "Proyecto", "fechaInicio": "2024-02-15", "fechaFinCompromiso": "2024-09-30", "fechaFinReal": null, "ultimaActualizacion": "2025-08-10" },
  { "idClarity": "PRJ002", "nombre": "Migración a Cloud", "estado": "Finalizado", "fase": "Cierre", "avanceReal": 100, "plazo": 100, "responsable": "Luis Ramírez", "gestor": "María Soto", "sponsor": "TI Corporativo", "segmentacion": "TI", "tipoTrabajo": "Proyecto", "fechaInicio": "2023-05-01", "fechaFinCompromiso": "2024-03-15", "fechaFinReal": "2024-03-10", "ultimaActualizacion": "2024-03-16" },
  { "idClarity": "PRJ003", "nombre": "Actualización Seguridad SOX", "estado": "En curso", "fase": "Planificación", "avanceReal": 20, "plazo": 40, "responsable": "Marta Aguilar", "gestor": "Jorge Vega", "sponsor": "Auditoría Interna", "segmentacion": "Normativo", "tipoTrabajo": "Evolutivo", "fechaInicio": "2025-01-10", "fechaFinCompromiso": "2025-10-30", "fechaFinReal": null, "ultimaActualizacion": "2025-08-12" },
  { "idClarity": "PRJ004", "nombre": "Canal de Atención WhatsApp", "estado": "En curso", "fase": "Desarrollo", "avanceReal": 60, "plazo": 55, "responsable": "Diego Ruiz", "gestor": "Sofía Vargas", "sponsor": "Marketing", "segmentacion": "Negocio", "tipoTrabajo": "Idea", "fechaInicio": "2025-03-01", "fechaFinCompromiso": "2025-12-15", "fechaFinReal": null, "ultimaActualizacion": "2025-08-14" },
  { "idClarity": "PRJ005", "nombre": "Optimización Core Bancario", "estado": "Vencido", "fase": "Ejecución", "avanceReal": 70, "plazo": 95, "responsable": "Claudia Díaz", "gestor": "Raúl Medina", "sponsor": "Banca Corporativa", "segmentacion": "Negocio", "tipoTrabajo": "Proyecto", "fechaInicio": "2024-07-20", "fechaFinCompromiso": "2025-06-30", "fechaFinReal": null, "ultimaActualizacion": "2025-07-25" },
  // Expanded data (25 more projects)
  { "idClarity": "PRJ006", "nombre": "Rediseño Portal Clientes", "estado": "Finalizado", "fase": "Cierre", "avanceReal": 100, "plazo": 100, "responsable": "Ana Torres", "gestor": "Sofía Vargas", "sponsor": "Marketing", "segmentacion": "Negocio", "tipoTrabajo": "Proyecto", "fechaInicio": "2023-10-01", "fechaFinCompromiso": "2024-06-01", "fechaFinReal": "2024-05-20", "ultimaActualizacion": "2024-06-05" },
  { "idClarity": "PRJ007", "nombre": "Data Warehouse Corporativo", "estado": "En curso", "fase": "Ejecución", "avanceReal": 80, "plazo": 85, "responsable": "Luis Ramírez", "gestor": "Carlos Pérez", "sponsor": "TI Corporativo", "segmentacion": "TI", "tipoTrabajo": "Proyecto", "fechaInicio": "2023-01-15", "fechaFinCompromiso": "2025-01-15", "fechaFinReal": null, "ultimaActualizacion": "2025-08-15" },
  { "idClarity": "PRJ008", "nombre": "App Móvil Interna", "estado": "Pausado", "fase": "Desarrollo", "avanceReal": 50, "plazo": 60, "responsable": "Marta Aguilar", "gestor": "María Soto", "sponsor": "Recursos Humanos", "segmentacion": "Interno", "tipoTrabajo": "Evolutivo", "fechaInicio": "2024-04-01", "fechaFinCompromiso": "2024-11-01", "fechaFinReal": null, "ultimaActualizacion": "2025-06-20" },
  { "idClarity": "PRJ009", "nombre": "Implantación Firma Digital", "estado": "En curso", "fase": "Ejecución", "avanceReal": 90, "plazo": 92, "responsable": "Diego Ruiz", "gestor": "Jorge Vega", "sponsor": "Legal", "segmentacion": "Normativo", "tipoTrabajo": "Proyecto", "fechaInicio": "2024-08-01", "fechaFinCompromiso": "2025-09-01", "fechaFinReal": null, "ultimaActualizacion": "2025-08-10" },
  { "idClarity": "PRJ010", "nombre": "Campaña Marketing Digital Q4", "estado": "Finalizado", "fase": "Cierre", "avanceReal": 100, "plazo": 100, "responsable": "Claudia Díaz", "gestor": "Sofía Vargas", "sponsor": "Marketing", "segmentacion": "Negocio", "tipoTrabajo": "Idea", "fechaInicio": "2024-09-01", "fechaFinCompromiso": "2024-12-31", "fechaFinReal": "2024-12-20", "ultimaActualizacion": "2025-01-05" },
  { "idClarity": "PRJ011", "nombre": "Plataforma E-learning", "estado": "En curso", "fase": "Desarrollo", "avanceReal": 30, "plazo": 25, "responsable": "Pedro Gómez", "gestor": "Laura Fernández", "sponsor": "Recursos Humanos", "segmentacion": "Interno", "tipoTrabajo": "Proyecto", "fechaInicio": "2025-02-01", "fechaFinCompromiso": "2026-02-01", "fechaFinReal": null, "ultimaActualizacion": "2025-08-01" },
  { "idClarity": "PRJ012", "nombre": "Renovación Infraestructura Servidores", "estado": "Vencido", "fase": "Ejecución", "avanceReal": 85, "plazo": 100, "responsable": "Luis Ramírez", "gestor": "Carlos Pérez", "sponsor": "TI Corporativo", "segmentacion": "TI", "tipoTrabajo": "Mantenimiento", "fechaInicio": "2023-06-01", "fechaFinCompromiso": "2024-06-01", "fechaFinReal": null, "ultimaActualizacion": "2024-07-15" },
  { "idClarity": "PRJ013", "nombre": "Adecuación GDPR", "estado": "Finalizado", "fase": "Cierre", "avanceReal": 100, "plazo": 100, "responsable": "Marta Aguilar", "gestor": "Jorge Vega", "sponsor": "Legal", "segmentacion": "Normativo", "tipoTrabajo": "Proyecto", "fechaInicio": "2023-11-01", "fechaFinCompromiso": "2024-05-25", "fechaFinReal": "2024-05-24", "ultimaActualizacion": "2024-05-30" },
  { "idClarity": "PRJ014", "nombre": "Sistema de Ticketing", "estado": "Cancelado", "fase": "Planificación", "avanceReal": 10, "plazo": 20, "responsable": "Diego Ruiz", "gestor": "María Soto", "sponsor": "TI Corporativo", "segmentacion": "TI", "tipoTrabajo": "Evolutivo", "fechaInicio": "2025-01-01", "fechaFinCompromiso": "2025-06-01", "fechaFinReal": null, "ultimaActualizacion": "2025-03-10" },
  { "idClarity": "PRJ015", "nombre": "Integración Pasarela de Pagos", "estado": "En curso", "fase": "Desarrollo", "avanceReal": 75, "plazo": 70, "responsable": "Ana Torres", "gestor": "Raúl Medina", "sponsor": "Dirección Comercial", "segmentacion": "Negocio", "tipoTrabajo": "Proyecto", "fechaInicio": "2024-10-01", "fechaFinCompromiso": "2025-09-15", "fechaFinReal": null, "ultimaActualizacion": "2025-08-11" },
  { "idClarity": "PRJ016", "nombre": "Programa de Fidelización", "estado": "Planificado", "fase": "Inicio", "avanceReal": 0, "plazo": 0, "responsable": "Claudia Díaz", "gestor": "Sofía Vargas", "sponsor": "Marketing", "segmentacion": "Negocio", "tipoTrabajo": "Idea", "fechaInicio": "2025-10-01", "fechaFinCompromiso": "2026-04-01", "fechaFinReal": null, "ultimaActualizacion": "2025-07-30" },
  { "idClarity": "PRJ017", "nombre": "Robotización de Procesos (RPA)", "estado": "En curso", "fase": "Ejecución", "avanceReal": 55, "plazo": 60, "responsable": "Pedro Gómez", "gestor": "Laura Fernández", "sponsor": "Operaciones", "segmentacion": "Interno", "tipoTrabajo": "Proyecto", "fechaInicio": "2024-09-01", "fechaFinCompromiso": "2025-11-01", "fechaFinReal": null, "ultimaActualizacion": "2025-08-14" },
  { "idClarity": "PRJ018", "nombre": "Auditoría de Código Fuente", "estado": "Finalizado", "fase": "Cierre", "avanceReal": 100, "plazo": 100, "responsable": "Luis Ramírez", "gestor": "Carlos Pérez", "sponsor": "Auditoría Interna", "segmentacion": "Normativo", "tipoTrabajo": "Mantenimiento", "fechaInicio": "2025-03-01", "fechaFinCompromiso": "2025-06-01", "fechaFinReal": "2025-05-28", "ultimaActualizacion": "2025-06-02" },
  { "idClarity": "PRJ019", "nombre": "Onboarding Digital Clientes", "estado": "En curso", "fase": "Desarrollo", "avanceReal": 80, "plazo": 75, "responsable": "Ana Torres", "gestor": "Raúl Medina", "sponsor": "Banca Corporativa", "segmentacion": "Negocio", "tipoTrabajo": "Proyecto", "fechaInicio": "2023-12-01", "fechaFinCompromiso": "2025-10-01", "fechaFinReal": null, "ultimaActualizacion": "2025-08-13" },
  { "idClarity": "PRJ020", "nombre": "Gestor Documental Centralizado", "estado": "Pausado", "fase": "Planificación", "avanceReal": 15, "plazo": 30, "responsable": "Marta Aguilar", "gestor": "Jorge Vega", "sponsor": "Operaciones", "segmentacion": "Interno", "tipoTrabajo": "Evolutivo", "fechaInicio": "2024-02-01", "fechaFinCompromiso": "2024-12-01", "fechaFinReal": null, "ultimaActualizacion": "2024-05-15" },
  { "idClarity": "PRJ021", "nombre": "Dashboard de Ventas", "estado": "Finalizado", "fase": "Cierre", "avanceReal": 100, "plazo": 100, "responsable": "Claudia Díaz", "gestor": "Sofía Vargas", "sponsor": "Dirección Comercial", "segmentacion": "Negocio", "tipoTrabajo": "Idea", "fechaInicio": "2024-01-10", "fechaFinCompromiso": "2024-04-10", "fechaFinReal": "2024-04-05", "ultimaActualizacion": "2024-04-15" },
  { "idClarity": "PRJ022", "nombre": "Plan de Continuidad de Negocio", "estado": "En curso", "fase": "Ejecución", "avanceReal": 65, "plazo": 70, "responsable": "Luis Ramírez", "gestor": "Carlos Pérez", "sponsor": "TI Corporativo", "segmentacion": "TI", "tipoTrabajo": "Proyecto", "fechaInicio": "2024-03-15", "fechaFinCompromiso": "2025-10-20", "fechaFinReal": null, "ultimaActualizacion": "2025-08-05" },
  { "idClarity": "PRJ023", "nombre": "Mejora Experiencia de Usuario (UX)", "estado": "En curso", "fase": "Desarrollo", "avanceReal": 40, "plazo": 35, "responsable": "Diego Ruiz", "gestor": "María Soto", "sponsor": "Marketing", "segmentacion": "Negocio", "tipoTrabajo": "Evolutivo", "fechaInicio": "2025-05-01", "fechaFinCompromiso": "2026-01-15", "fechaFinReal": null, "ultimaActualizacion": "2025-08-14" },
  { "idClarity": "PRJ024", "nombre": "Migración Telefonía IP", "estado": "Vencido", "fase": "Ejecución", "avanceReal": 90, "plazo": 100, "responsable": "Pedro Gómez", "gestor": "Laura Fernández", "sponsor": "TI Corporativo", "segmentacion": "TI", "tipoTrabajo": "Mantenimiento", "fechaInicio": "2023-08-01", "fechaFinCompromiso": "2024-07-01", "fechaFinReal": null, "ultimaActualizacion": "2024-08-01" },
  { "idClarity": "PRJ025", "nombre": "Portal del Empleado", "estado": "Finalizado", "fase": "Cierre", "avanceReal": 100, "plazo": 100, "responsable": "Marta Aguilar", "gestor": "Jorge Vega", "sponsor": "Recursos Humanos", "segmentacion": "Interno", "tipoTrabajo": "Proyecto", "fechaInicio": "2023-03-01", "fechaFinCompromiso": "2024-02-01", "fechaFinReal": "2024-01-25", "ultimaActualizacion": "2024-02-10" },
  { "idClarity": "PRJ026", "nombre": "Automatización Informes Regulatorios", "estado": "En curso", "fase": "Desarrollo", "avanceReal": 25, "plazo": 40, "responsable": "Luis Ramírez", "gestor": "Carlos Pérez", "sponsor": "Auditoría Interna", "segmentacion": "Normativo", "tipoTrabajo": "Evolutivo", "fechaInicio": "2025-04-01", "fechaFinCompromiso": "2026-03-01", "fechaFinReal": null, "ultimaActualizacion": "2025-08-12" },
  { "idClarity": "PRJ027", "nombre": "Plataforma IoT para Activos", "estado": "Planificado", "fase": "Inicio", "avanceReal": 5, "plazo": 10, "responsable": "Pedro Gómez", "gestor": "Laura Fernández", "sponsor": "Operaciones", "segmentacion": "TI", "tipoTrabajo": "Idea", "fechaInicio": "2025-11-01", "fechaFinCompromiso": "2026-11-01", "fechaFinReal": null, "ultimaActualizacion": "2025-08-01" },
  { "idClarity": "PRJ028", "nombre": "Pruebas de Penetración Anuales", "estado": "En curso", "fase": "Ejecución", "avanceReal": 50, "plazo": 50, "responsable": "Luis Ramírez", "gestor": "Carlos Pérez", "sponsor": "TI Corporativo", "segmentacion": "TI", "tipoTrabajo": "Mantenimiento", "fechaInicio": "2025-07-01", "fechaFinCompromiso": "2025-09-01", "fechaFinReal": null, "ultimaActualizacion": "2025-08-15" },
  { "idClarity": "PRJ029", "nombre": "Análisis de Competencia Digital", "estado": "Finalizado", "fase": "Cierre", "avanceReal": 100, "plazo": 100, "responsable": "Claudia Díaz", "gestor": "Sofía Vargas", "sponsor": "Marketing", "segmentacion": "Negocio", "tipoTrabajo": "Idea", "fechaInicio": "2025-06-01", "fechaFinCompromiso": "2025-08-01", "fechaFinReal": "2025-07-25", "ultimaActualizacion": "2025-08-02" },
  { "idClarity": "PRJ030", "nombre": "Certificación ISO 27001", "estado": "En curso", "fase": "Planificación", "avanceReal": 10, "plazo": 25, "responsable": "Marta Aguilar", "gestor": "Jorge Vega", "sponsor": "Auditoría Interna", "segmentacion": "Normativo", "tipoTrabajo": "Proyecto", "fechaInicio": "2024-11-01", "fechaFinCompromiso": "2026-05-01", "fechaFinReal": null, "ultimaActualizacion": "2025-07-20" }
];

// --- UTILITY FUNCTIONS ---
const getUniqueValues = <T, K extends keyof T>(data: T[], key: K) => [...new Set(data.map(item => item[key]))].sort() as (T[K])[];

const countBy = <T extends Record<string, any>>(data: T[], key: keyof T): Record<string, number> => data.reduce((acc: Record<string, number>, item) => {
    const value = item[key] as string;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
}, {});


// --- CHART COMPONENTS ---
const ChartComponent = ({ type, data, options, title }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        
        // Destroy previous chart instance if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        chartRef.current = new Chart(ctx, {
            type,
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: title,
                        font: { size: 16 }
                    }
                },
                ...options
            }
        });

        // Cleanup function
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [data, type, options, title]); // Re-render chart when data or options change

    return html`<div class="chart-container"><canvas ref=${canvasRef}></canvas></div>`;
};


// --- UI COMPONENTS ---
const Filters = ({ data, filters, setFilters }) => {
    const uniqueValues = useMemo(() => ({
        estados: getUniqueValues(data, 'estado'),
        tiposTrabajo: getUniqueValues(data, 'tipoTrabajo'),
        segmentaciones: getUniqueValues(data, 'segmentacion'),
        responsables: getUniqueValues(data, 'responsable'),
        gestores: getUniqueValues(data, 'gestor'),
        sponsors: getUniqueValues(data, 'sponsor'),
        anios: [...new Set(data.map(d => new Date(d.fechaInicio).getFullYear()))].sort()
    }), [data]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return html`
        <div class="filters-container card">
            ${Object.entries({
                estado: uniqueValues.estados,
                tipoTrabajo: uniqueValues.tiposTrabajo,
                segmentacion: uniqueValues.segmentaciones,
                responsable: uniqueValues.responsables,
                gestor: uniqueValues.gestores,
                sponsor: uniqueValues.sponsors,
                anio: uniqueValues.anios,
            }).map(([key, values]) => html`
                <div class="filter-item">
                    <label for=${key}>${key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <select id=${key} value=${filters[key]} onChange=${(e) => handleFilterChange(key, (e.target as HTMLSelectElement).value)}>
                        <option value="Todos">Todos</option>
                        ${values.map(val => html`<option value=${val}>${val}</option>`)}
                    </select>
                </div>
            `)}
        </div>
    `;
};

const KPIs = ({ data }: { data: Project[] }) => {
    const stats = useMemo(() => {
        const total = data.length;
        if (total === 0) return { total: 0, finalizados: 0, enCurso: 0, vencidos: 0, avancePromedio: 0 };

        const finalizados = data.filter(p => p.estado === 'Finalizado').length;
        const enCurso = data.filter(p => p.estado === 'En curso').length;
        const vencidos = data.filter(p => p.estado === 'Vencido').length;
        const avanceTotal = data.reduce((sum, p) => sum + p.avanceReal, 0);
        const avancePromedio = total > 0 ? (avanceTotal / total).toFixed(1) : 0;

        return {
            total,
            finalizados: ((finalizados / total) * 100).toFixed(1),
            enCurso: ((enCurso / total) * 100).toFixed(1),
            vencidos: ((vencidos / total) * 100).toFixed(1),
            avancePromedio
        };
    }, [data]);

    return html`
        <div class="kpi-grid">
            <div class="kpi-card card">
                <div class="kpi-value">${stats.total}</div>
                <div class="kpi-label">Total Proyectos</div>
            </div>
            <div class="kpi-card card">
                <div class="kpi-value">${stats.finalizados}%</div>
                <div class="kpi-label">Finalizados</div>
            </div>
            <div class="kpi-card card">
                <div class="kpi-value">${stats.enCurso}%</div>
                <div class="kpi-label">En Curso</div>
            </div>
            <div class="kpi-card card">
                <div class="kpi-value">${stats.vencidos}%</div>
                <div class="kpi-label">Vencidos</div>
            </div>
             <div class="kpi-card card">
                <div class="kpi-value">${stats.avancePromedio}%</div>
                <div class="kpi-label">Avance Promedio</div>
            </div>
        </div>
    `;
};

// --- TAB COMPONENTS ---

const TabGeneral = ({ data }: { data: Project[] }) => {
    const estadoData = useMemo(() => {
        const counts = countBy(data, 'estado');
        return {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9E9E9E', '#607D8B'],
            }]
        };
    }, [data]);

    const faseData = useMemo(() => {
        const counts = countBy(data, 'fase');
        return {
            labels: Object.keys(counts),
            datasets: [{
                label: 'Proyectos por Fase',
                data: Object.values(counts),
                backgroundColor: '#3F51B5',
            }]
        };
    }, [data]);

    return html`
        <div class="tab-content">
            <div class="grid-2">
                 <div class="card"><${ChartComponent} type="doughnut" data=${estadoData} title="Proyectos por Estado" /></div>
                 <div class="card"><${ChartComponent} type="bar" data=${faseData} title="Proyectos por Fase (Embudo)" options=${{ indexAxis: 'y' }} /></div>
            </div>
            <div class="card">
                <h3>Tabla Ejecutiva</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Responsable</th>
                                <th>Estado</th>
                                <th>Avance %</th>
                                <th>Fin Compromiso</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.slice(0, 10).map(p => html`
                                <tr>
                                    <td>${p.nombre}</td>
                                    <td>${p.responsable}</td>
                                    <td><span class="status-badge status-${p.estado.toLowerCase().replace(' ', '-')}">${p.estado}</span></td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-bar-fill" style="width: ${p.avanceReal}%"></div>
                                            <span>${p.avanceReal}%</span>
                                        </div>
                                    </td>
                                    <td>${p.fechaFinCompromiso}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

const TabCumplimiento = ({ data }: { data: Project[] }) => {
    const timelineData = useMemo(() => {
        const counts = data.reduce((acc: Record<string, number>, p) => {
            const year = new Date(p.fechaInicio).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});
        return {
            labels: Object.keys(counts).sort(),
            datasets: [{
                label: 'Inicios por Año',
                data: Object.values(counts),
                borderColor: '#009688',
                tension: 0.1
            }]
        };
    }, [data]);

    const vencidosData = useMemo(() => {
        const vencidos = data.filter(p => p.estado === 'Vencido');
        const counts = countBy(vencidos, 'responsable');
        return {
            labels: Object.keys(counts),
            datasets: [{
                label: 'Proyectos Vencidos por Responsable',
                data: Object.values(counts),
                backgroundColor: '#E91E63'
            }]
        };
    }, [data]);

    const scatterData = useMemo(() => ({
        datasets: [{
            label: 'Avance vs Plazo',
            data: data.map(p => ({ x: p.plazo, y: p.avanceReal })),
            backgroundColor: 'rgba(75, 192, 192, 0.5)'
        }]
    }), [data]);

    return html`
        <div class="tab-content">
            <div class="grid-2">
                <div class="card"><${ChartComponent} type="line" data=${timelineData} title="Línea de Tiempo (Inicios por Año)" /></div>
                <div class="card"><${ChartComponent} type="bar" data=${vencidosData} title="Proyectos Vencidos" options=${{ indexAxis: 'y' }} /></div>
            </div>
            <div class="card">
                <${ChartComponent} type="scatter" data=${scatterData} title="Dispersión Avance Real vs Plazo" options=${{ scales: { x: { title: { display: true, text: '% Plazo' } }, y: { title: { display: true, text: '% Avance Real' } } } }} />
            </div>
        </div>
    `;
};

const TabEstrategia = ({ data }: { data: Project[] }) => {
    const segmentacionData = useMemo(() => {
        const counts = countBy(data, 'segmentacion');
        return {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#FF9800', '#8BC34A', '#03A9F4', '#9C27B0'],
            }]
        };
    }, [data]);

    const tipoTrabajoData = useMemo(() => {
        const types = getUniqueValues(data, 'tipoTrabajo');
        const states = getUniqueValues(data, 'estado');
        const stateColors = {'En curso': '#2196F3', 'Finalizado': '#4CAF50', 'Vencido': '#F44336', 'Pausado': '#FFC107', 'Cancelado': '#9E9E9E', 'Planificado': '#607D8B'};
        
        return {
            labels: types,
            datasets: states.map(state => ({
                label: state,
                data: types.map(type => data.filter(p => p.tipoTrabajo === type && p.estado === state).length),
                backgroundColor: stateColors[state] || '#CCCCCC'
            }))
        };
    }, [data]);

    return html`
        <div class="tab-content">
            <div class="grid-2">
                <div class="card"><${ChartComponent} type="pie" data=${segmentacionData} title="Proyectos por Segmentación" /></div>
                <div class="card"><${ChartComponent} type="bar" data=${tipoTrabajoData} title="Estado por Tipo de Trabajo" options=${{ scales: { x: { stacked: true }, y: { stacked: true } } }} /></div>
            </div>
        </div>
    `;
};

const TabGobierno = ({ data }: { data: Project[] }) => {
    const rankingGestores = useMemo(() => {
        const counts = countBy(data, 'gestor');
        const sorted = Object.entries(counts).sort(([,a],[,b]) => b-a);
        return {
            labels: sorted.map(([label]) => label),
            datasets: [{
                label: 'Proyectos por Gestor',
                data: sorted.map(([,value]) => value),
                backgroundColor: '#795548',
            }]
        };
    }, [data]);

     const rankingSponsors = useMemo(() => {
        const counts = countBy(data, 'sponsor');
        const sorted = Object.entries(counts).sort(([,a],[,b]) => b-a);
        return {
            labels: sorted.map(([label]) => label),
            datasets: [{
                label: 'Proyectos por Sponsor',
                data: sorted.map(([,value]) => value),
                backgroundColor: '#673AB7',
            }]
        };
    }, [data]);

    const getFrescura = (dateStr: string) => {
        const daysDiff = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff <= 30) return { label: 'Reciente', color: 'green' };
        if (daysDiff <= 90) return { label: 'Medio', color: 'orange' };
        return { label: 'Antiguo', color: 'red' };
    };

    const proyectosSinActualizar = data
        .map(p => ({...p, dias: Math.floor((new Date().getTime() - new Date(p.ultimaActualizacion).getTime()) / (1000 * 60 * 60 * 24))}))
        .filter(p => p.dias > 90)
        .sort((a, b) => b.dias - a.dias);


    return html`
        <div class="tab-content">
            <div class="grid-2">
                <div class="card"><${ChartComponent} type="bar" data=${rankingGestores} title="Ranking de Gestores" /></div>
                <div class="card"><${ChartComponent} type="bar" data=${rankingSponsors} title="Ranking de Sponsors" /></div>
            </div>
            <div class="card">
                <h3>Semáforo de Frescura de Datos</h3>
                <div class="table-container">
                     <table>
                        <thead>
                            <tr>
                                <th>Proyecto</th>
                                <th>Última Actualización</th>
                                <th>Frescura</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.slice(0, 10).map(p => html`
                                <tr>
                                    <td>${p.nombre}</td>
                                    <td>${p.ultimaActualizacion}</td>
                                    <td>
                                        <span class="traffic-light ${getFrescura(p.ultimaActualizacion).color}"></span>
                                        ${getFrescura(p.ultimaActualizacion).label}
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            </div>
             <div class="card">
                <h3>Proyectos Sin Actualizar (>90 días)</h3>
                <div class="table-container">
                     <table>
                        <thead>
                            <tr>
                                <th>Proyecto</th>
                                <th>Gestor</th>
                                <th>Días sin actualizar</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${proyectosSinActualizar.map(p => html`
                                <tr>
                                    <td>${p.nombre}</td>
                                    <td>${p.gestor}</td>
                                    <td>${p.dias}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};


// --- MAIN APP COMPONENT ---
const App = () => {
    const [activeTab, setActiveTab] = useState('General');
    const [filters, setFilters] = useState({
        estado: 'Todos',
        tipoTrabajo: 'Todos',
        segmentacion: 'Todos',
        responsable: 'Todos',
        gestor: 'Todos',
        sponsor: 'Todos',
        anio: 'Todos'
    });

    const filteredData = useMemo(() => {
        return projectData.filter(p => {
            const anioProyecto = new Date(p.fechaInicio).getFullYear().toString();
            return (filters.estado === 'Todos' || p.estado === filters.estado) &&
                (filters.tipoTrabajo === 'Todos' || p.tipoTrabajo === filters.tipoTrabajo) &&
                (filters.segmentacion === 'Todos' || p.segmentacion === filters.segmentacion) &&
                (filters.responsable === 'Todos' || p.responsable === filters.responsable) &&
                (filters.gestor === 'Todos' || p.gestor === filters.gestor) &&
                (filters.sponsor === 'Todos' || p.sponsor === filters.sponsor) &&
                (filters.anio === 'Todos' || anioProyecto === filters.anio);
        });
    }, [filters]);

    const tabs = {
        'General': html`<${TabGeneral} data=${filteredData} />`,
        'Cumplimiento': html`<${TabCumplimiento} data=${filteredData} />`,
        'Estrategia': html`<${TabEstrategia} data=${filteredData} />`,
        'Gobierno': html`<${TabGobierno} data=${filteredData} />`,
    };

    return html`
        <div class="dashboard-container">
            <header>
                <h1>Dashboard Ejecutivo de Proyectos</h1>
            </header>
            <nav class="tabs">
                ${Object.keys(tabs).map(tabName => html`
                    <button 
                        class=${activeTab === tabName ? 'active' : ''}
                        onClick=${() => setActiveTab(tabName)}
                    >
                        ${tabName}
                    </button>
                `)}
            </nav>
            <main>
                <${Filters} data=${projectData} filters=${filters} setFilters=${setFilters} />
                <${KPIs} data=${filteredData} />
                ${tabs[activeTab]}
            </main>
        </div>
    `;
};

render(html`<${App} />`, document.getElementById('app'));
