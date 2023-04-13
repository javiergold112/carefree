from PIL import Image
from typing import List

from cfdraw import *


@cache_resource
def get_models():
    import torch
    from diffusers import DiffusionPipeline
    from diffusers import StableDiffusionPipeline
    from diffusers import StableDiffusionImg2ImgPipeline

    tag = "runwayml/stable-diffusion-v1-5"
    m = DiffusionPipeline.from_pretrained(tag, torch_dtype=torch.float16)
    if torch.cuda.is_available():
        m.to("cuda")
    target_props = [
        "vae",
        "text_encoder",
        "tokenizer",
        "unet",
        "scheduler",
        "safety_checker",
        "feature_extractor",
    ]
    sub_models = {k: v for k, v in vars(m).items() if k in target_props}
    txt2img = StableDiffusionPipeline(**sub_models)
    img2img = StableDiffusionImg2ImgPipeline(**sub_models)
    return txt2img, img2img


# copying parameters from https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/text2img#diffusers.StableDiffusionPipeline.__call__
txt2img_fields = dict(
    prompt=ITextField(),
    negative_prompt=ITextField(placeholder="Negative Prompt"),
    height=INumberField(default=512, min=64, max=1024, step=64, isInt=True),
    width=INumberField(default=512, min=64, max=1024, step=64, isInt=True),
    num_inference_steps=INumberField(
        default=25, min=5, max=100, step=1, isInt=True, label="Steps"
    ),
    guidance_scale=INumberField(
        default=7.5, min=-20.0, max=25.0, step=0.5, precision=1, label="Cfg Scale"
    ),
    num_images_per_prompt=INumberField(
        default=1, min=1, max=4, step=1, isInt=True, label="Num images"
    ),
)
# https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/img2img#diffusers.StableDiffusionImg2ImgPipeline.__call__
img2img_fields = txt2img_fields.copy()
img2img_fields.pop("height")
img2img_fields.pop("width")
img2img_fields["strength"] = INumberField(default=0.8, min=0.0, max=1.0, step=0.01)


class HttpTextToImagePlugin(IHttpFieldsPlugin):
    @property
    def settings(self) -> IPluginSettings:
        return IPluginSettings(
            w=600,
            h=400,
            nodeConstraint=NodeConstraints.NONE,
            src="https://ailab-huawei-cdn.nolibox.com/upload/images/53a458da3f88422aaaca79f85a9a769a.png",
            pivot=PivotType.RIGHT,
            follow=False,
            # Since there are quite a few parameters, we use Modal to display them
            useModal=True,
            pluginInfo=IHttpFieldsPluginInfo(
                header="Text to Image",
                numColumns=2,
                definitions=txt2img_fields,
                submitToastMessage="Generating images using the `diffusers` 🤗 library...",
            ),
        )

    def process(self, data: IHttpPluginRequest) -> List[Image.Image]:
        return get_models()[0](**data.extraData).images


class HttpImageToImagePlugin(IHttpPlugin):
    @property
    def type(self) -> PluginType:
        return PluginType.HTTP_FIELDS

    @property
    def settings(self) -> IPluginSettings:
        return IPluginSettings(
            w=600,
            h=400,
            nodeConstraint=NodeConstraints.IMAGE,
            src="https://ailab-huawei-cdn.nolibox.com/upload/images/65f383ac60df4334905299aaa6f0b3d1.png",
            pivot=PivotType.RT,
            follow=True,
            useModal=True,
            pluginInfo=IHttpFieldsPluginInfo(
                header="Image to Image",
                numColumns=2,
                definitions=img2img_fields,
            ),
        )

    def process(self, data: IHttpPluginRequest) -> List[Image.Image]:
        image = self.load_image(data.nodeData.src)
        return get_models()[1](image=image, **data.extraData).images


# uncomment this line to pre-load the models
# get_models()
register_plugin("txt2img")(HttpTextToImagePlugin)
register_plugin("img2img")(HttpImageToImagePlugin)
register_all_available_plugins()
app = App()
