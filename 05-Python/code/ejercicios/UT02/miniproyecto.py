ventas = []
while True :
  print("========== TAQUILLA DE CINE ==========")
  print("1. Vender entradas")
  print("2. Consultar resumen de ventas")
  print("3. Salir")
  try:
      opcion = int(input("Selecciona una opción: "))
  except ValueError:
      print("Opción no valida")
      continue

  match opcion:
        case 1:
            try:
                nombre_cliente = input("Introduzca el nombre del cliente: ")
                edad_cliente = int(input("Introduzca la edad del cliente: "))
                tipo_entrada =""
                numero_entradas = int(input("Introduzca el numero de entradas: "))
                if edad_cliente < 0 or numero_entradas <= 0:
                    raise ValueError
            except ValueError:
                print("El valor de alguna de las variables no es correcta, intentelo de nuevo")
                continue
            if edad_cliente < 5:
                precio = 0
                tipo_entrada = "Infantil gratuita"
            elif edad_cliente < 18:
                precio = 5
                tipo_entrada = "Menores"
            elif edad_cliente < 65:
                precio = 9
                tipo_entrada = "General"
            else:
                precio = 6
                tipo_entrada = "Sénior"
            total_compra = precio * numero_entradas
            ventas.append({"cliente": nombre_cliente, "entradas": numero_entradas, "total": total_compra})
            print("========== TICKET ==========")
            print(f"Cliente: {nombre_cliente}")
            print(f"Tipo: {tipo_entrada}")
            print(f"Precio por entrada: {precio}")
            print(f"TOTAL: {total_compra} €")
            print("============================")
        case 2:
            if not ventas:
                print("Todavía no hay ventas")
            else:
                total_entradas = 0
                recaudacion = 0
                for venta in ventas:
                    total_entradas += venta["entradas"]
                    recaudacion += venta["total"]
                print("========== RESUMEN DE VENTAS ==========")
                print(f"Operaciones realizadas: {ventas,length}")
                print(f"Entradas vendidas: {total_entradas}")
                print(f"Recaudación: {recaudacion} €")
                print ("=======================================")
        case 3:
            print("Hasta luego")
            break
        case _:
            print("Opcion no valida")
