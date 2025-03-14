from typing import Any
from typing import Dict
from collections import defaultdict
from cfcreator.workflow import *
from cfcreator.endpoints import *
from cfcreator.sdks.apis import *

from cfdraw import cache_resource
from cfdraw import INodeData
from cfdraw.schema.plugins import WorkNode
from cfdraw.schema.plugins import Workflow
from cfdraw.schema.plugins import InjectionPack
from cfdraw.core.toolkit.misc import random_hash


DATA_MODEL_KEY = "$data_model"

UPLOAD_META_TYPE = "upload"
ADD_TEXT_META_TYPE = "add.text"
PYTHON_FIELDS_META_TYPE = "python.fields"

Txt2ImgKey = "txt2img"
Txt2ImgWithTextKey = "txt2img_text"
Img2ImgKey = "img2img"
SRKey = "sr"
SODKey = "sod"
CaptioningKey = "captioning"
InpaintingKey = "inpainting"
SDInpaintingKey = "sd_inpainting"
SDOutpaintingKey = "sd_outpainting"
VariationKey = "variation"
ControlNetHintKey = "control_net_hint"
MultiControlNetKey = "multi_control_net"
ImageHarmonizationKey = "image_harmonization"
PromptEnhanceKey = "prompt_enhance"
DrawWorkflowKey = "draw_workflow"
ExecuteWorkflowKey = "execute_workflow"

key2endpoints = {
    Txt2ImgKey: txt2img_sd_endpoint,
    Txt2ImgWithTextKey: txt2img_sd_endpoint,
    Img2ImgKey: img2img_sd_endpoint,
    SRKey: img2img_sr_endpoint,
    SODKey: img2img_sod_endpoint,
    CaptioningKey: img2txt_caption_endpoint,
    InpaintingKey: img2img_inpainting_endpoint,
    SDInpaintingKey: txt2img_sd_inpainting_endpoint,
    SDOutpaintingKey: txt2img_sd_outpainting_endpoint,
    VariationKey: None,
    ControlNetHintKey: CONTROL_HINT_ENDPOINT,
    MultiControlNetKey: new_control_multi_endpoint,
    ImageHarmonizationKey: img2img_harmonization_endpoint,
    PromptEnhanceKey: txt2txt_prompt_enhance_endpoint,
}


@cache_resource
def get_apis() -> APIs:
    return APIs()


def trace_workflow(meta: Dict[str, Any], nodeData: INodeData) -> Workflow:
    def _get_key(k: str) -> str:
        new_key = f"{k}_{counts[k]}"
        counts[k] += 1
        return new_key

    def _convert_field_key(k: str) -> str:
        # list field workaround
        k_split = k.split(".")
        if len(k_split) >= 3:
            k_split.insert(2, "data")
            k = ".".join(k_split)
        return k

    def _trace(meta_: Dict[str, Any], nodeData: INodeData) -> None:
        mtype, mdata = map(meta_.get, ["type", "data"])
        if mtype is None or mdata is None:
            return
        alias = mdata.get("alias", random_hash())
        key = alias2key.get(alias)
        if key is not None and workflow.get(key) is not None:
            return
        if mtype == UPLOAD_META_TYPE:
            if key is None:
                key = _get_key(UPLOAD_META_TYPE)
            alias2key[alias] = key
            workflow.push(
                WorkNode(
                    key=key,
                    endpoint=UPLOAD_ENDPOINT,
                    injections={},
                    data=dict(url=nodeData.src or ""),
                )
            )
        elif mtype == ADD_TEXT_META_TYPE:
            if key is None:
                key = _get_key(ADD_TEXT_META_TYPE)
            alias2key[alias] = key
            workflow.push(
                WorkNode(
                    key=key,
                    endpoint=ADD_TEXT_ENDPOINT,
                    injections={},
                    data=dict(text=nodeData.text or ""),
                )
            )
        elif mtype == PYTHON_FIELDS_META_TYPE:
            identifier, response = map(mdata.get, ["identifier", "response"])
            if identifier is None or response is None:
                return
            extra_response = response.get("extra", {})
            if not extra_response:
                return
            if identifier == VariationKey:
                identifier = extra_response.get("task")
                if identifier is None:
                    return
            data_model_d = extra_response.get(DATA_MODEL_KEY)
            if data_model_d is None:
                return
            raw_injections = mdata.get("injections", {})
            injections = {}
            for k, v in raw_injections.items():
                k = _convert_field_key(k)
                v_node = v.get("node")
                if v_node is None:
                    continue
                try:
                    v_nodeData = INodeData(**v_node)
                except Exception as err:
                    raise ValueError(f"invalid node data occurred ({err})")
                v_meta = v_nodeData.meta
                v_type, v_data = map(v_meta.get, ["type", "data"])
                if v_type is None or v_data is None:
                    continue
                v_alias = v_data.get("alias", random_hash())
                v_key = alias2key.get(v_alias)
                if v_type == UPLOAD_META_TYPE or v_type == ADD_TEXT_META_TYPE:
                    if v_key is None:
                        v_key = _get_key(v_type)
                        alias2key[v_alias] = v_key
                    v_injection_pack = InjectionPack(index=0, field=k)
                elif v_type == PYTHON_FIELDS_META_TYPE:
                    v_identifier = v_data.get("identifier")
                    if v_identifier is None:
                        continue
                    v_index = v_data.get("response", {}).get("index", 0)
                    v_injection_pack = InjectionPack(index=v_index, field=k)
                    if v_key is None:
                        v_key = _get_key(v_identifier)
                        alias2key[v_alias] = v_key
                else:
                    raise ValueError(f"unknown type: {v_type}")
                injections.setdefault(v_key, []).append(v_injection_pack)
                _trace(v_meta, v_nodeData)
            if key is None:
                key = _get_key(identifier)
            alias2key[alias] = key
            workflow.push(
                WorkNode(
                    key=key,
                    endpoint=key2endpoints[identifier],
                    injections=injections,
                    data=data_model_d,
                )
            )
        else:
            raise ValueError(f"unknown type: {mtype}")

    counts = defaultdict(int)
    workflow = Workflow()
    alias2key = {}
    _trace(meta, nodeData)
    return workflow


__all__ = [
    "UPLOAD_META_TYPE",
    "ADD_TEXT_META_TYPE",
    "DATA_MODEL_KEY",
    "Txt2ImgKey",
    "Txt2ImgWithTextKey",
    "Img2ImgKey",
    "SRKey",
    "SODKey",
    "CaptioningKey",
    "InpaintingKey",
    "SDInpaintingKey",
    "SDOutpaintingKey",
    "VariationKey",
    "ControlNetHintKey",
    "MultiControlNetKey",
    "ImageHarmonizationKey",
    "PromptEnhanceKey",
    "DrawWorkflowKey",
    "ExecuteWorkflowKey",
    "get_apis",
    "trace_workflow",
    "key2endpoints",
    "HighresModel",
    "Img2TxtModel",
    "Txt2ImgSDModel",
    "Img2ImgSDModel",
    "Img2ImgSRModel",
    "Img2ImgSODModel",
    "Img2ImgInpaintingModel",
    "Txt2ImgSDInpaintingModel",
    "Txt2ImgSDOutpaintingModel",
    "ControlNetHints",
    "ControlMultiModel",
    "Img2ImgHarmonizationModel",
    "PromptEnhanceModel",
]
