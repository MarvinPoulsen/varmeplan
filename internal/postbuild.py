import os

def postbuild():
    try:
        dist_dir = os.path.join(os.path.dirname(__file__), '../dist')
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                if file.endswith('.html'):
                    file_path = os.path.join(root, file)
                    with open(file_path, 'r') as file:
                        file_content = file.read()
                    if file_path.endswith('index.html'):
                        # Erstat 'http://localhost:8080/' med '/'
                        file_content = file_content.replace('http://localhost:8080/', '/')
                    else:
                        # Erstat de øvrige HTML-filer med 'https://kort.lolland.dk/'
                        # file_content = file_content.replace('http://localhost:8080/', 'https://kort.lolland.dk/')
                        file_content = file_content.replace('http://localhost:8080/', '/')
                    with open(file_path, 'w') as file:
                        file.write(file_content)
                    print(f'Fil {os.path.basename(file_path)} blev opdateret med succes')
    except Exception as e:
        print('Der opstod en fejl:', e)

postbuild()
