# Python

Ejercicios sueltos de Python, fuera del temario de 2º de DAW. Se conservan como
práctica de sintaxis, control de flujo y validación de datos.

## Estructura

```
05-Python/
├── code/
│   └── ejercicios/
│       ├── Ej1.py                 # ticket de compra
│       └── UT02/
│           ├── Tablamultiplicar.py
│           ├── ejercicioAlumnos.py
│           └── miniproyecto.py
└── capturas/                      # capturas de clase
```

## Ejercicios

| Archivo | Qué hace | Estado |
| --- | --- | --- |
| [`code/ejercicios/Ej1.py`](code/ejercicios/Ej1.py) | Ticket de compra: subtotal, descuento, IVA y total con formato a 2 decimales | terminado |
| [`code/ejercicios/UT02/Tablamultiplicar.py`](code/ejercicios/UT02/Tablamultiplicar.py) | Pide un número y muestra su tabla del 1 al 10 | terminado |
| [`code/ejercicios/UT02/ejercicioAlumnos.py`](code/ejercicios/UT02/ejercicioAlumnos.py) | Pide número de alumnos y notas, y dice quién suspende | **incompleto**: el `continue` y el control de la nota están mal colocados; puede quedarse en bucle o usar una variable sin asignar |
| [`code/ejercicios/UT02/miniproyecto.py`](code/ejercicios/UT02/miniproyecto.py) | Taquilla de cine: calcula el precio según la edad | **incompleto**: las condiciones (`5 < edad > 17`) no expresan los tramos y falta imprimir el total |

> Los dos últimos se dejan tal cual a propósito. Primero hay que arreglar la lógica en
> clase y entender por qué falla; no se completan desde fuera.

## Cómo ejecutar

```bash
cd code/ejercicios
python Ej1.py

cd UT02
python Tablamultiplicar.py
```

Requiere **Python 3**. No hay dependencias externas.
