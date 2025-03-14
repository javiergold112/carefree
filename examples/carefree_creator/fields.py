from cfdraw import *
from pathlib import Path
from collections import OrderedDict
from cfcreator.common import SDSamplers
from cflearn.api.cv.diffusion import SDVersions
from cflearn.api.cv.diffusion import ControlNetHints


# common styles
common_styles = dict(
    w=0.75,
    h=0.6,
    maxW=800,
    minH=520,
    useModal=True,
)
common_group_styles = dict(w=230, h=110)
# common diffusion fields
w_field = INumberField(
    default=512,
    min=64,
    max=1024,
    step=64,
    isInt=True,
    label=I18N(
        zh="宽",
        en="Width",
    ),
    tooltip=I18N(
        zh="生成图片的宽度",
        en="The width of the generated image",
    ),
)
h_field = w_field.copy()
h_field.label = I18N(zh="高", en="Height")
h_field.tooltip = I18N(zh="生成图片的高度", en="The height of the generated image")
max_wh_field = INumberField(
    default=1024,
    min=256,
    max=2048,
    step=64,
    isInt=True,
    label=I18N(
        zh="最大宽高",
        en="Max WH",
    ),
    tooltip=I18N(
        zh="把图片传给模型处理前，会先把图片限制在这个尺寸内",
        en="Before passing the image to the model, the image will be ensured to be within this size",
    ),
)
text = ITextField(
    label=I18N(
        zh="提示词",
        en="Prompt",
    ),
    numRows=2,
    tooltip=I18N(
        zh="想要生成的图片的描述",
        en="The description of the image",
    ),
)
version_field = I18NSelectField(
    mapping={
        SDVersions.v1_5: I18N(zh="基础模型", en="Base Model"),
        SDVersions.ANIME_ANYTHING: I18N(zh="动漫模型", en="Anime Model"),
        SDVersions.DREAMLIKE: I18N(zh="艺术模型", en="Art Model"),
    },
    default=SDVersions.v1_5,
    label=I18N(zh="模型", en="Model"),
)
sampler = ISelectField(
    default=SDSamplers.K_EULER,
    options=[sampler for sampler in SDSamplers],
    label=I18N(
        zh="采样器",
        en="Sampler",
    ),
)
num_steps = INumberField(
    default=20,
    min=5,
    max=100,
    step=1,
    isInt=True,
    label=I18N(
        zh="采样步数",
        en="Steps",
    ),
)
negative_prompt = ITextField(
    label=I18N(
        zh="负面词",
        en="Negative Prompt",
    ),
    numRows=2,
    tooltip=I18N(
        zh="不想图片中出现的东西的描述",
        en="The negative description of the image",
    ),
)
guidance_scale = INumberField(
    default=7.5,
    min=-20.0,
    max=25.0,
    step=0.5,
    precision=1,
    label=I18N(
        zh="扣题程度",
        en="Cfg Scale",
    ),
)
seed = INumberField(
    default=-1,
    min=-1,
    max=2**32,
    step=1,
    scale=NumberScale.LOGARITHMIC,
    isInt=True,
    label=I18N(
        zh="随机种子",
        en="Seed",
    ),
    tooltip=I18N(
        zh="'-1' 表示种子将会被随机生成",
        en="'-1' means the seed will be randomly generated",
    ),
)
use_circular = IBooleanField(
    default=False,
    label=I18N(
        zh="循环纹样",
        en="Circular",
    ),
    tooltip=I18N(
        zh="是否让模型尝试生成四方连续纹样",
        en="Whether should we generate circular patterns (i.e., generate textures)",
    ),
)
use_highres = IBooleanField(
    default=False,
    label=I18N(
        zh="高清生成",
        en="Highres",
    ),
    tooltip=I18N(
        zh="生成 2 倍宽高的图片",
        en="Generate images with 2x width & height",
    ),
)
highres_fidelity = INumberField(
    default=0.3,
    min=0.0,
    max=1.0,
    step=0.05,
    label=I18N(
        zh="相似度",
        en="Fidelity",
    ),
    tooltip=I18N(
        zh="高清生成的图片与直出图片的相似度",
        en="How similar the (2x) generated image should be to the (original) generated image",
    ),
    condition="use_highres",
)
lora_field = IListField(
    label="LoRA",
    tooltip=I18N(zh="配置 LoRA 模型", en="Setup LoRA models"),
    item=dict(
        model=ISelectLocalField(
            label=I18N(
                zh="模型",
                en="Model",
            ),
            path=str(Path(__file__).parent / "lora"),
            noExt=True,
            onlyFiles=True,
            regex=".*\\.safetensors",
            defaultPlaceholder="None",
        ),
        strength=INumberField(
            default=1.0,
            min=0.0,
            max=4.0,
            step=0.05,
            precision=2,
            label=I18N(
                zh="强度",
                en="Strength",
            ),
        ),
    ),
)
# txt2img
txt2img_fields = OrderedDict(
    w=w_field,
    h=h_field,
    text=text,
    version=version_field,
    sampler=sampler,
    negative_prompt=negative_prompt,
    num_steps=num_steps,
    guidance_scale=guidance_scale,
    use_circular=use_circular,
    seed=seed,
    use_highres=use_highres,
    lora=lora_field,
    highres_fidelity=highres_fidelity,
)
txt2img_text_fields = OrderedDict(
    w=w_field,
    h=h_field,
    negative_prompt=negative_prompt,
    version=version_field,
    sampler=sampler,
    num_steps=num_steps,
    guidance_scale=guidance_scale,
    use_circular=use_circular,
    seed=seed,
    use_highres=use_highres,
    lora=lora_field,
    highres_fidelity=highres_fidelity,
)
# sd_inpainting / sd_outpainting fields
sd_inpainting_prompt = text.copy()
sd_inpainting_prompt.numRows = 3
sd_inpainting_fields = OrderedDict(
    text=sd_inpainting_prompt,
    sampler=sampler,
    num_steps=num_steps,
    guidance_scale=guidance_scale,
    negative_prompt=negative_prompt,
    seed=seed,
    focus_mode=IBooleanField(
        default=False,
        label=I18N(zh="聚焦模式", en="Focus Mode"),
        tooltip=I18N(
            zh="启用聚焦模式时，模型会仅关注蒙版区域及周边的一些像素，此时生成的效果通常会富有更多的细节",
            en="When enabled, the model will only focus on the masked region and some surrounding pixels, which usually results in more detailed images",
        ),
    ),
)
# img2img fields
fidelity = INumberField(
    default=0.2,
    min=0.0,
    max=1.0,
    step=0.05,
    label=I18N(
        zh="相似度",
        en="Fidelity",
    ),
    tooltip=I18N(
        zh="生成图片与当前图片的相似度",
        en="How similar the generated image should be to the input image",
    ),
)
img2img_prompt = text.copy()
img2img_prompt.numRows = 3
img2img_fields = OrderedDict(
    text=img2img_prompt,
    fidelity=fidelity,
    version=version_field,
    sampler=sampler,
    negative_prompt=negative_prompt,
    num_steps=num_steps,
    guidance_scale=guidance_scale,
    use_circular=use_circular,
    seed=seed,
    use_highres=use_highres,
    lora=lora_field,
    highres_fidelity=highres_fidelity,
)
# super resolution fields
sr_w_field = w_field.copy()
sr_w_field.default = 2048
sr_w_field.min = 1024
sr_w_field.max = 3072
sr_h_field = h_field.copy()
sr_h_field.default = 2048
sr_h_field.min = 1024
sr_h_field.max = 3072
sr_fields = OrderedDict(
    is_anime=IBooleanField(
        default=False,
        label=I18N(
            zh="动漫模型",
            en="Use Anime Model",
        ),
        tooltip=I18N(
            zh="是否使用在动漫图片上微调过的超分辨率模型",
            en="Whether should we use the super resolution model which is finetuned on anime images.",
        ),
    ),
    target_w=sr_w_field,
    target_h=sr_h_field,
)
# inpainting fields
inpainting_fields = OrderedDict(
    model=ISelectField(
        default="lama",
        options=["sd", "lama"],
        label=I18N(
            zh="模型",
            en="Model",
        ),
        tooltip=I18N(
            zh="用来进行局部擦除的模型；`lama` 会更快、更稳定，`sd` 会比较慢，但有时会提供更多的细节",
            en=(
                "The inpainting model to use. "
                "`lama` is faster and more stable, but `sd` may introduce more details."
            ),
        ),
    ),
)
# variation fields
variation_fields = OrderedDict(fidelity=img2img_fields["fidelity"])
# controlnet stuffs
## controlnet hints
controlnet_hint_fields = I18NSelectField(
    mapping={
        ControlNetHints.CANNY: I18N(zh="Canny 边缘", en="Canny Edge"),
        ControlNetHints.DEPTH: I18N(zh="深度图", en="Depth Image"),
        ControlNetHints.MLSD: I18N(zh="MLSD 边缘", en="MLSD Edge"),
        ControlNetHints.POSE: I18N(zh="人体姿态", en="Human Pose"),
    },
    default=ControlNetHints.CANNY,
    label=I18N(zh="参考图类型", en="Hint Type"),
)
## multi ControNet
controlnet_fields = OrderedDict(
    type=controlnet_hint_fields,
    hint_url=IImageField(default="", label=I18N(zh="参考图", en="Hint Image")),
    bypass_annotator=IBooleanField(
        default=False,
        label=I18N(zh="跳过预处理器", en="Bypass Annotator"),
        tooltip=I18N(
            zh="跳过 ControlNet 的预处理步骤，适用于选择的图片已经是参考图的情况",
            en="Bypass the ControlNet annotator, useful when you have already selected the hint image",
        ),
    ),
    hint_start=INumberField(
        default=0.0,
        min=0.0,
        max=1.0,
        step=0.01,
        label=I18N(zh="参考图生效时机", en="Hint Start"),
    ),
    control_strength=INumberField(
        default=1.0,
        min=0.0,
        max=2.0,
        step=0.01,
        label=I18N(zh="参考强度", en="Control Strength"),
    ),
)
multi_controlnet_field = IListField(
    label="ControlNet",
    tooltip=I18N(zh="配置 multi ControlNet", en="Setup multi ControlNet"),
    item=controlnet_fields,
)
multi_controlnet_prompt = text.copy()
multi_controlnet_prompt.numRows = 4
multi_controlnet_negative_prompt = negative_prompt.copy()
multi_controlnet_negative_prompt.numRows = 4
multi_controlnet_fields = OrderedDict(
    prompt=multi_controlnet_prompt,
    url=IImageField(
        default="",
        label=I18N(zh="初始图", en="Init Image"),
        tooltip=I18N(
            zh="可选项，不选也没问题", en="This is optional, you can leave it blank"
        ),
    ),
    fidelity=fidelity,
    max_wh=max_wh_field,
    base_model=version_field,
    negative_prompt=multi_controlnet_negative_prompt,
    sampler=sampler,
    num_steps=num_steps,
    guidance_scale=guidance_scale,
    seed=seed,
    lora=lora_field,
    controls=multi_controlnet_field,
)
# image harmonization
harmonization_fields = OrderedDict(
    url=IImageField(
        default="",
        label=I18N(zh="原图", en="Image"),
        tooltip=I18N(
            zh="想要进行风格融合的原图", en="The original image to be harmonized"
        ),
    ),
    mask_url=IImageField(
        default="",
        label=I18N(zh="前景", en="Foreground"),
        tooltip=I18N(
            zh="想要进行风格融合的前景区域", en="The foreground area to be harmonized"
        ),
    ),
    strength=INumberField(
        default=1.0,
        min=0.0,
        max=2.0,
        step=0.01,
        label=I18N(zh="融合强度", en="Strength"),
    ),
)
# prompt enhance
prompt_enhance_fields = OrderedDict(
    num_return_sequences=INumberField(
        default=1,
        min=1,
        max=3,
        step=1,
        isInt=True,
        label=I18N(zh="数量", en="Num Returns"),
        tooltip=I18N(zh="返回的结果数量", en="The number of results to return"),
    ),
)


__all__ = [
    "common_styles",
    "common_group_styles",
    "lora_field",
    "version_field",
    "txt2img_fields",
    "txt2img_text_fields",
    "img2img_fields",
    "sr_fields",
    "inpainting_fields",
    "sd_inpainting_fields",
    "variation_fields",
    "controlnet_hint_fields",
    "multi_controlnet_fields",
    "harmonization_fields",
    "prompt_enhance_fields",
]
