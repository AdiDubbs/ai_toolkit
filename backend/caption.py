import transformers.dynamic_module_utils
from typing import Union, List
import os
import re

def get_imports(filename: Union[str, os.PathLike]) -> List[str]:
    """
    Extracts all the libraries (not relative imports this time) that are imported in a file.

    Args:
        filename (`str` or `os.PathLike`): The module file to inspect.

    Returns:
        `List[str]`: The list of all packages required to use the input module.
    """
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    # filter out try/except block so in custom code we can have try/except imports
    content = re.sub(r"\s*try\s*:\s*.*?\s*except\s*.*?:", "", content, flags=re.MULTILINE | re.DOTALL)

    # Imports of the form `import xxx`
    imports = re.findall(r"^\s*import\s+(\S+)\s*$", content, flags=re.MULTILINE)
    # Imports of the form `from xxx import yyy`
    imports += re.findall(r"^\s*from\s+(\S+)\s+import", content, flags=re.MULTILINE)
    # Only keep the top-level module
    imports = [imp.split(".")[0] for imp in imports if not imp.startswith(".")]
    # Exclude flash_attn from the imports
    imports = [imp for imp in imports if imp != "flash_attn"]
    return list(set(imports))

transformers.dynamic_module_utils.get_imports = get_imports

from transformers import AutoProcessor, AutoModelForCausalLM
from PIL import Image

model_id = 'microsoft/Florence-2-base'

model = AutoModelForCausalLM.from_pretrained(model_id, trust_remote_code=True)
processor = AutoProcessor.from_pretrained(model_id, trust_remote_code=True)

def generate_caption(image: Image.Image) -> str:
    prompt = "<MORE_DETAILED_CAPTION>"
    inputs = processor(text=prompt, images=image, return_tensors="pt")
    generated_ids = model.generate(
        input_ids=inputs["input_ids"],
        pixel_values=inputs["pixel_values"],
        max_new_tokens=1024,
        num_beams=3,
        do_sample=False,
    )
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]
    parsed_answer = processor.post_process_generation(generated_text, task="<MORE_DETAILED_CAPTION>", image_size=(image.width, image.height))
    return parsed_answer['<MORE_DETAILED_CAPTION>']