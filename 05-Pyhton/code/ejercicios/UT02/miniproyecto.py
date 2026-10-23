# Proyecto: Taquilla de cine
# Autores: Nombre del alumno 1 y nombre del alumno 2
total_operaciones = 0
total_entradas = 0
total_recaudado = 0.0
while True:
    print("\n========== TAQUILLA DE CINE ==========")
    print("1. Vender entradas")
    print("2. Consultar resumen de ventas")
    print("3. Salir")
    opcion = input("Selecciona una opción: ")
    if opcion == "1":
        try: 
        nombreCliente = print("Introduzca el nombre del cliente")
        edadCliente = int(print("Introduzca la edad del cliente"))
        numeroEntradas = int(print("Numero de entradas"))
        except ValueError:
            print("Error de formato, por favor, introduzca un numero")
        finally:
            pass
    elif opcion == "2":
# Mostrar el resumen de ventas
        pass
    elif opcion == "3":
    # Finalizar el programa
        break
else:
    print("Opción no válida")