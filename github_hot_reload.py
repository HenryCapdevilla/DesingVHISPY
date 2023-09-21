import git
import time

repo_path = '/var/www/html'  # Ruta de tu repositorio local

while True:
    try:
        repo = git.Repo(repo_path)
        origin = repo.remotes.origin

        # Obtiene el commit más reciente en la rama principal (main)
        origin.fetch()
        head = repo.head.reference
        latest_commit = origin.refs[f'origin/{head}'].commit

        # Compara el commit actual con el commit más reciente
        if repo.head.commit != latest_commit:
            print("Actualizando el repositorio...")
            repo.remotes.origin.pull()
            print("Repositorio actualizado.")
        else:
            print("No hay cambios en el repositorio.")

    except Exception as e:
        print("Error:", str(e))

    # Espera un minuto antes de verificar de nuevo (puedes ajustar el intervalo)
    time.sleep(60)
