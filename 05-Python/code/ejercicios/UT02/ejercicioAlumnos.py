while True:
    # Solicitar el número de alumnos
    try:
        numeroAlumnos = int(input("Introduzca el número de alumnos por favor: "))
        if numeroAlumnos < 0:
            raise ValueError
        break
    except ValueError:
        print("El numero de alumnos debe ser un entero positivo")

# Pedir la nota y el nombre de cada alumno
for _ in range(numeroAlumnos):
    # Controlar que la nota sea numérica y esté en el rango 0-10
    while True:
        try:
            nota = float(input("Ingrese la nota del alumno por favor: "))
        except ValueError:
            print("La nota debe ser un número")
            continue

        if nota < 0 or nota > 10:
            print("La nota debe estar entre 0 y 10")
            continue

        break

    nombre = input("Ingrese el nombre del alumno por favor: ")

    if nota < 5:
        print(f"El alumno {nombre} está suspenso")
    else:
        print(f"El alumno {nombre} está aprobado")
