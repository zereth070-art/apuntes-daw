while True:
    try:
        numero = int(input("Introduzca un numero: "))
        break
    except ValueError:
        print("Debe introducir un número entero")

for i in range(1, 11):
    resultado = numero * i
    print(f"{numero} x {i} = {resultado}")
