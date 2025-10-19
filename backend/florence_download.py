# Download Florence-2 with the patch
import os
from unittest.mock import patch
from transformers import AutoProcessor, AutoModelForCausalLM
from transformers.dynamic_module_utils import get_imports

# Workaround function to remove flash_attn from imports
def fixed_get_imports(filename: str | os.PathLike) -> list[str]:
    '''Remove flash_attn from the imports list'''
    if not str(filename).endswith('modeling_florence2.py'):
        return get_imports(filename)
    imports = get_imports(filename)
    if 'flash_attn' in imports:
        imports.remove('flash_attn')
    return imports

print('Downloading Florence-2-base with macOS patch...')
print('This will download ~500MB of model files...')

# Download processor
print('\n[1/2] Downloading processor...')
processor = AutoProcessor.from_pretrained(
    'microsoft/Florence-2-base',
    trust_remote_code=True
)
print('✅ Processor downloaded')

# Download model with patch applied
print('\n[2/2] Downloading model (with flash_attn workaround)...')
with patch('transformers.dynamic_module_utils.get_imports', fixed_get_imports):
    model = AutoModelForCausalLM.from_pretrained(
        'microsoft/Florence-2-base',
        trust_remote_code=True
    )
print('✅ Model downloaded successfully!')

print('\n🎉 Florence-2-base is ready to use on your M3 Pro!')
print('The workaround removes the flash_attn requirement.')
print('No performance impact - flash_attn is only for NVIDIA GPUs.')