import subprocess
import time

# Ruta local donde se encuentra tu repositorio clonado
local_repo_path = "/var/www/html"

# URL del repositorio remoto en GitHub
github_repo_url = "https://github.com/HenryCapdevilla/DesingVHISPY.git"

while True:
    try:
        # Ejecuta "git fetch" para obtener las actualizaciones del repositorio
        subprocess.run(["git", "fetch"], cwd=local_repo_path, check=True)

        # Comprueba si hay cambios en la rama principal (main)
        result = subprocess.run(["git", "status", "-uno"], cwd=local_repo_path, stdout=subprocess.PIPE, text=True)
        status_output = result.stdout

        # Verifica si hay cambios locales sin confirmar
        uncommitted_changes = "Changes not staged for commit" in status_output

        if uncommitted_changes:
            print("Hay cambios locales sin confirmar. Realizando confirmación automática.")
            # Confirma los cambios automáticamente con un mensaje
            subprocess.run(["git", "commit", "-am", "Commit automático antes de la actualización"], cwd=local_repo_path, check=True)
            print("Cambios confirmados exitosamente.")

            # Realiza un pull automático para incorporar las actualizaciones más recientes del repositorio remoto
            subprocess.run(["git", "pull"], cwd=local_repo_path, check=True)
            print("Actualización local realizada exitosamente.")

        # Si hay cambios en la rama principal, realiza una actualización (pull)
        if "Your branch is behind" in status_output:
            subprocess.run(["git", "pull"], cwd=local_repo_path, check=True)
            print("Se ha realizado una actualización exitosamente.")
        else:
            print("No se encontraron cambios en la rama principal.")

        # Realiza un empuje (push) automático para enviar los cambios al repositorio remoto
        subprocess.run(["git", "push"], cwd=local_repo_path, check=True)
        print("Cambios empujados al repositorio remoto.")

    except subprocess.CalledProcessError as e:
        print(f"Error al ejecutar el comando Git: {e}")

    # Espera un tiempo antes de volver a verificar actualizaciones (por ejemplo, cada 5 minutos)
    time.sleep(60)  # Espera 300 segundos (5 minutos)

