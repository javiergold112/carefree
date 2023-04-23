import time

from typing import List
from typing import Optional

from cfdraw.schema.plugins import PluginType
from cfdraw.schema.plugins import IMiddleWare
from cfdraw.schema.plugins import IPluginRequest
from cfdraw.schema.plugins import IPluginResponse


class TimerMiddleWare(IMiddleWare):
    t: Optional[float]

    @property
    def can_handle_response(self) -> bool:
        return True

    @property
    def subscriptions(self) -> List[PluginType]:
        return [PluginType.FIELDS]

    async def before(self, request: IPluginRequest) -> None:
        self.t = time.time()

    async def process(self, response: IPluginResponse) -> IPluginResponse:
        if self.t is None:
            return response
        response.data["_duration"] = time.time() - self.t
        return response


__all__ = [
    "TimerMiddleWare",
]
