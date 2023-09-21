import git
import time

repo_path = '/var/www/html/.'  # Ruta de tu repositorio local

repo = git.Repo(repo_path)

while True:
    try:
        # Obtiene el commit más reciente en la rama principal "main"
        repo.remotes.origin.fetch()
        latest_commit = repo.remotes.origin.refs['Henry'].commit

        # Compara el commit actual en la rama principal "main" con el commit más reciente
        if repo.heads.main.commit != latest_commit:
            print("Actualizando el repositorio en la rama 'Henry'...")
            repo.remotes.origin.pull('origin/Henry')
            print("Repositorio actualizado en la rama 'Henry'.")
        else:
            print("No hay cambios en la rama 'Henry' 'main'.")

    except Exception as e:
        print("Error:", str(e))

    # Espera un minuto antes de verificar de nuevo (puedes ajustar el intervalo)
    time.sleep(60)
