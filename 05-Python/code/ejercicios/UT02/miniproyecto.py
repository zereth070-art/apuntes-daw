while True :
    try:
        nombre_cliente = input("Introduzca el nombre del cliente")
        edad_cliente = int(input("Introduzca la edad del cliente"))
        numero_entradas = int(input("Introduzca el numero de entradas"))
    except ValueError:
        print("El valor de alguna de las variables no es correcta, intentelo de nuevo")
    if 5 < edad_cliente:
        precio = 0
    elif 5 < edad_cliente > 17:
        precio = 5
    elif 18 < edad_cliente > 64:
            precio = 5
        