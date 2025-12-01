import os
import re

mappings = [
    (r'@/lib/database', '@backend/lib/database'),
    (r'@/lib/auth', '@backend/lib/auth'),
    (r'@/lib/arcjet', '@backend/lib/arcjet'),
    (r'@/lib/orpc\.server', '@backend/lib/orpc.server'),
    (r'@/lib/serializer', '@backend/lib/serializer'),
    (r'@/lib/providers', '@frontend/lib/providers'),
    (r'@/lib/theme-provider', '@frontend/lib/theme-provider'),
    (r'@/lib/orpc', '@frontend/lib/orpc'),
    (r'@/lib/query', '@frontend/lib/query'),
    (r'@/lib/utils', '@shared/utils'),
    (r'@/lib/get-avatar', '@shared/utils/get-avatar'),
    (r'@/models', '@backend/models'),
    (r'@/app/middlewares', '@backend/middlewares'),
    (r'@/app/schemas', '@backend/schemas'),
    (r'@/app/router', '@frontend/app/router'),
    (r'@/components', '@frontend/components'),
]

root_dir = '.'

for root, dirs, files in os.walk(root_dir):
    if 'node_modules' in root or '.next' in root or '.git' in root:
        continue
    
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r') as f:
                content = f.read()
            
            new_content = content
            for old, new in mappings:
                # Replace import ... from "..."
                new_content = re.sub(f'from ["\']{old}', f'from "{new}', new_content)
                # Replace import("...")
                new_content = re.sub(f'import\(["\']{old}', f'import("{new}', new_content)
            
            if new_content != content:
                print(f"Updating {file_path}")
                with open(file_path, 'w') as f:
                    f.write(new_content)
