import os


try:
    dist_dir = os.path.join(os.path.dirname(__file__), '../dist')
    print(' - dist_dir: ',dist_dir, '\n - type: ', type(dist_dir))
    
    file_paths = os.listdir(dist_dir)
    print('file_paths: ',file_paths)

except Exception as e:
    print('Der opstod en fejl:', e)