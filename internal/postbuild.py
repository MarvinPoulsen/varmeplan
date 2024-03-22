import os
import re
shared_filename = 'heatplans.js'
try:
    # Definerer stien til mappen 'dist'
    dist_dir = os.path.join(os.path.dirname(__file__), '../dist')
    
    # Lister alle filer i mappen 'dist'
    files = os.listdir(dist_dir)
    
    # Går igennem alle filer i mappen 'dist'
    for filename in files:
        
        # Tjekker om filnavnet indeholder et tal
        if re.search(r'\d',filename):
            
            # Gemmer filnavnet
            shared_file = filename
            
            # Går igennem alle filer i mappen 'dist' igen
            for file in files:
                
                # Tjekker om filen ender med '.html'
                if file.endswith('.html'):
                    
                    # Definerer stien til html-filen
                    file_path = os.path.join(dist_dir, file)
                    
                    # Åbner og læser html-filen
                    with open(file_path, 'r') as file:
                        file_content = file.read()
                        
                        # Erstatter filnavnet i html-filens indhold med shared_filename
                        file_content = file_content.replace(shared_file, shared_filename)
                        
                        # Tjekker om html-filen er 'index.html'
                        if file_path.endswith('index.html'):
                            
                            # Erstatter 'http://localhost:8080/' med '/' i 'index.html'
                            file_content = file_content.replace('http://localhost:8080/', '/')
                        else:
                            
                            # Erstatter 'http://localhost:8080/' med 'https://kort.lolland.dk/' i de andre html-filer
                            # file_content = file_content.replace('http://localhost:8080/', 'https://kort.lolland.dk/')
                            file_content = file_content.replace('http://localhost:8080/', '/')
                    
                    # Åbner html-filen igen og skriver det opdaterede indhold til filen
                    with open(file_path, 'w') as file:
                        file.write(file_content)
            
            # Definerer den gamle og nye sti til filen
            old_name = os.path.join(dist_dir, shared_file)
            new_name = os.path.join(dist_dir, shared_filename)
            
            # Omdøber filen
            os.rename(old_name, new_name)
except Exception as e:
    # Printer fejlmeddelelsen, hvis der opstår en fejl
    print('Der opstod en fejl:', e)