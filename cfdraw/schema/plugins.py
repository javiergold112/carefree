from abc import abstractmethod
from abc import ABC
from enum import Enum
from typing import Any
from typing import Dict
from typing import TypeVar
from typing import Optional
from pydantic import Field
from pydantic import BaseModel

from cfdraw.parsers.noli import parse_node
from cfdraw.parsers.noli import INode
from cfdraw.parsers.noli import PivotType
from cfdraw.parsers.noli import NodeConstraints
from cfdraw.parsers.chakra import IChakra
from cfdraw.parsers.chakra import TextAlign


TPluginModel = TypeVar("TPluginModel")


class PluginType(str, Enum):
    HTTP_TEXT_AREA = "httpTextArea"
    HTTP_QA = "httpQA"


# general


class IPluginInfo(BaseModel):
    """The actual data used in `usePython` hook & each React component."""

    updateInterval: int = Field(
        0,
        ge=0,
        description="If > 0, the plugin will be called every `updateInterval` ms",
    )


class IPluginSettings(IChakra):
    # required fields
    w: int = Field(..., gt=0, description="Width of the expanded plugin")
    h: int = Field(..., gt=0, description="Height of the expanded plugin")
    nodeConstraint: NodeConstraints = Field(
        ...,
        description="""
Spcify when the plugin will be shown.
> If set to 'none', the plugin will always be shown.
> If set to 'anyNode', the plugin will be shown when any node is selected.
> If set to 'singleNode', the plugin will be shown when only one node is selected.
> If set to 'multiNode', the plugin will be shown when more than one node is selected.
> Otherwise, the plugin will be shown when the selected node is of the specified type.
""",
    )
    # style fields
    src: str = Field(
        "",
        description="""
The image url that will be shown for the plugin.
> If not specified, we will use a default plugin-ish image.
""",
    )
    pivot: Optional[PivotType] = Field(
        None,
        description="""
Pivot of the plugin.
> If `follow` is set to `true`, the plugin will be shown at the pivot of the selected node.
> Otherwise, the plugin will be shown at the pivot of the entire drawboard.
""",
    )
    follow: Optional[bool] = Field(
        None,
        description="Whether the plugin follows the node",
    )
    expandOffsetX: Optional[int] = Field(
        None,
        description="X offset of the expanded plugin",
    )
    expandOffsetY: Optional[int] = Field(
        None,
        description="Y offset of the expanded plugin",
    )
    iconW: Optional[int] = Field(None, description="Width of the plugin button")
    iconH: Optional[int] = Field(None, description="Height of the plugin button")
    offsetX: Optional[int] = Field(None, description="X offset of the plugin button")
    offsetY: Optional[int] = Field(None, description="Y offset of the plugin button")
    bgOpacity: Optional[float] = Field(None, description="Opacity of the plugin button")
    useModal: bool = Field(False, description="Whether popup a modal for the plugin")
    modalOpacity: Optional[float] = Field(None, description="Opacity of the modal")
    # React fields
    pluginInfo: IPluginInfo = Field(IPluginInfo(), description="Plugin info")


# web

## http


class IRawHttpPluginRequest(BaseModel):
    identifier: str = Field(..., description="The identifier of the plugin")
    data: Dict[str, Any] = Field(..., description="The extra data of the request")
    node: Optional[Dict[str, Any]] = Field(
        None,
        description="JSON data of the selected node",
    )

    def parse(self) -> "IHttpPluginRequest":
        if self.node is None:
            return self
        d = self.dict()
        d["node"] = parse_node(self.node)
        return IHttpPluginRequest(**d)


class IHttpPluginRequest(IRawHttpPluginRequest):
    node: Optional[INode] = Field(None, description="The parsed selected node")


class IHttpResponse(BaseModel):
    success: bool = Field(..., description="Whether returned successfully")
    message: str = Field(..., description="The message of the response")
    data: BaseModel = Field(..., description="The data of the response")


## socket


class ISocketPluginMessage(IHttpPluginRequest):
    data: Dict[str, Any] = Field(..., description="The extra data of the message")


class ISocketResponse(BaseModel):
    data: BaseModel = Field(..., description="The data of the response")


# plugin interface


class IPlugin(ABC):
    identifier: str

    # abstract

    @property
    @abstractmethod
    def type(self) -> PluginType:
        pass

    @property
    @abstractmethod
    def settings(self) -> IPluginSettings:
        pass

    @abstractmethod
    def __call__(self, data: Any) -> Any:
        pass

    # api

    def to_plugin_settings(self, identifier: str) -> Dict[str, Any]:
        d = self.settings.dict()
        plugin_info = d.pop("pluginInfo")
        # `identifier` has hashed into `{identifier}.{hash}`
        plugin_info["endpoint"] = f"/{'.'.join(identifier.split('.')[:-1])}"
        plugin_info["identifier"] = identifier
        plugin_type = f"_python.{self.type}"
        offset_x = d.pop("offsetX")
        offset_y = d.pop("offsetY")
        node_constraint = d.pop("nodeConstraint")
        chakra_props = {}
        for field in IChakra.__fields__:
            chakra_value = d.pop(field)
            if chakra_value is not None:
                chakra_props[field] = chakra_value
        for k, v in list(d.items()):
            if v is None:
                d.pop(k)
        props = dict(
            nodeConstraint=node_constraint,
            pluginInfo=plugin_info,
            renderInfo=d,
            **chakra_props,
        )
        if offset_x is not None:
            props["offsetX"] = offset_x
        if offset_y is not None:
            props["offsetY"] = offset_y
        return dict(type=plugin_type, props=props)


# (react) bindings

## (http) text area


class IHttpTextAreaPluginInfo(IPluginInfo):
    noLoading: bool = Field(
        False, description="Whether to show the 'Loading...' text or not"
    )
    textAlign: Optional[TextAlign] = Field(None, description="Text align")


class HttpTextAreaModel(BaseModel):
    text: str = Field(..., description="The text to be displayed")


class HttpTextAreaResponse(IHttpResponse):
    data: HttpTextAreaModel = Field(..., description="The data of the response")


## (http) qa


class IHttpQAPluginInfo(IPluginInfo):
    initialText: str = Field(
        ...,
        description="The initial text to be displayed in the text area",
    )


__all__ = [
    "PluginType",
    # noli
    "PivotType",
    "NodeConstraints",
    # chakra
    "TextAlign",
    # plugins
    "IPluginSettings",
    "IRawHttpPluginRequest",
    "IHttpPluginRequest",
    "IHttpResponse",
    "ISocketPluginMessage",
    "ISocketResponse",
    "IPlugin",
    # bindings
    "IHttpTextAreaPluginInfo",
    "HttpTextAreaModel",
    "HttpTextAreaResponse",
    "IHttpQAPluginInfo",
]
