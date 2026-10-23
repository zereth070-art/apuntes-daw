while True:
# Solicitar el número de alumnos

    try :
        numeroAlumnos = int(input("Introduzca el número de alumnos por favor: "))
    except ValueError:
        print("El numero de alumnos debe ser positivo")

# Pedir nombre y nota de cada alumno
    while numeroAlumnos > 0:
    # Controlar que la nota sea numérica
        try:
            nota = float(input("Ingrese la nota del alumno por favor: "))
        except ValueError:
            print("La nota debe ser un número")
        continue

    # Controlar el rango
    if nota < 0 or nota > 10:
        print("La nota debe estar entre 0 y 10")
        continue

    nombre = input("Ingrese el nombre del alumno por favor: ")

    if nota < 5:
        print(f"El alumno {nombre} está suspenso")

    numeroAlumnos -= 1
