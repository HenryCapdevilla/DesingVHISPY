import socket
import threading
import mysql.connector

def udp_server(port):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.bind(('0.0.0.0', port))
    print(f"UDP server listening on port {port}")

    while True:
        data, addr = s.recvfrom(65535)  # Tamaño máximo UDP
        print(f"Received UDP data from {addr}: {data.decode('utf-8')}")

        try:
            connection = mysql.connector.connect(
                host=config["database"]["host"],
                user=config["database"]["user"],
                password=config["database"]["password"],
                database=config["database"]["name"]
            )
            
            cursor = connection.cursor()

            data_to_insert = data.decode("utf-8")
            # Asumiendo que los valores están separados por comas
            latitud, longitud, fecha, hora = data_to_insert.split(',')

            insert_query = config["sql_query"]
            cursor.execute(insert_query, (latitud, longitud, fecha, hora))

            connection.commit()
            print("Datos insertados correctamente en la base de datos.")

        except mysql.connector.Error as err:
            print(f"Error during database operation: {err}")
            if 'connection' in locals() or 'connection' in globals():
                connection.rollback()  # Rollback changes if an error occurs

        finally:
            if 'cursor' in locals() or 'cursor' in globals():
                cursor.close()
            if 'connection' in locals() or 'connection' in globals():
                connection.close()


if __name__ == "__main__":
    with open('config.json', 'r') as config_file:
        config = json.load(config_file)
    
    port = 25000
    udp_thread = threading.Thread(target=udp_server, args=(port,))
    udp_thread.start()
    udp_thread.join()
