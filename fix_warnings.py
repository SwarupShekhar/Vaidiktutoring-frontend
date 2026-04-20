import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    new_content = content
    # aspect ratio
    new_content = re.sub(r'\baspect-\[3/2\]\b', 'aspect-3/2', new_content)
    new_content = re.sub(r'\baspect-\[4/5\]\b', 'aspect-4/5', new_content)
    
    # border radius
    new_content = re.sub(r'\brounded-\[1\.5rem\]\b', 'rounded-3xl', new_content)
    new_content = re.sub(r'\brounded-\[2rem\]\b', 'rounded-4xl', new_content)
    
    # duplicate italic
    new_content = re.sub(r'\bitalic group-hover:text-primary transition-colors italic\b', 'italic group-hover:text-primary transition-colors', new_content)
    new_content = re.sub(r'\bitalic group-hover:text-sapphire transition-colors italic\b', 'italic group-hover:text-sapphire transition-colors', new_content)
    new_content = re.sub(r'italic([^"\'<>]*)italic', r'italic\1', new_content) # Be careful, maybe multiple italics on same line? Let's just do a specific one
    # Specifically: leading-tight italic group-hover:text-primary transition-colors italic
    new_content = re.sub(r'(leading-tight|tracking-tighter)\s+italic(.*?)italic', r'\1 \2italic', new_content)
    
    # flex/block
    new_content = re.sub(r'\bblock mb-4 flex\b', 'mb-4 flex', new_content)
    
    # gradients
    new_content = re.sub(r'\bbg-gradient-to-br\b', 'bg-linear-to-br', new_content)
    new_content = new_content.replace('_var(--tw-gradient-stops)', 'var(--tw-gradient-stops)')
    
    # flex-shrink
    new_content = re.sub(r'\bflex-shrink-0\b', 'shrink-0', new_content)
    
    # blur
    new_content = re.sub(r'\bblur-\[40px\]\b', 'blur-2xl', new_content)
    
    # opacity in background
    # bg-red-500/[0.02] -> bg-red-500/2
    new_content = re.sub(r'bg-([a-z]+)-500/\[0\.0(\d)\]', r'bg-\1-500/\2', new_content)

    # text colors IPProgrammePageClient.tsx 247
    # "text-deep-navy dark:text-white mb-2 text-violet-600"
    new_content = new_content.replace('text-deep-navy dark:text-white mb-2 text-violet-600', 'text-violet-600 dark:text-violet-400 mb-2')
    new_content = new_content.replace('text-deep-navy dark:text-white uppercase mb-2 text-violet-600', 'text-violet-600 dark:text-violet-400 uppercase mb-2')

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False

modified = 0
for root, dirs, files in os.walk('src/app'):
    for file in files:
        if file.endswith('.tsx'):
            if process_file(os.path.join(root, file)):
                modified += 1
print(f"Modified {modified} files")
