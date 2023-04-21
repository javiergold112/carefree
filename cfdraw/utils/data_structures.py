from typing import Dict
from typing import List
from typing import Generic
from typing import TypeVar
from typing import Optional


TItemData = TypeVar("TItemData")


class Item(Generic[TItemData]):
    def __init__(self, key: str, data: TItemData) -> None:
        self.key = key
        self.data = data


class Bundle(Generic[TItemData]):
    def __init__(self, *, no_mapping: bool = False) -> None:
        """
        * use mapping is fast at the cost of doubled memory.
        * for the `queue` use case, mapping is not needed because all operations
        focus on the first item.

        Details
        -------
        * no_mapping = False
            * get    : O(1)
            * push   : O(1)
            * remove : O(1) (if not found) / O(n)
        * no_mapping = True
            * get    : O(n)
            * push   : O(1)
            * remove : O(n)
        * `queue` (both cases, so use no_mapping = False to save memory)
            * get    : O(1)
            * push   : O(1)
            * remove : O(1)
        """

        self._items: List[Item[TItemData]] = []
        self._mapping: Optional[Dict[str, Item[TItemData]]] = None if no_mapping else {}

    def __len__(self) -> int:
        return len(self._items)

    @property
    def first(self) -> Optional[Item[TItemData]]:
        if self.is_empty:
            return None
        return self._items[0]

    @property
    def last(self) -> Optional[Item[TItemData]]:
        if self.is_empty:
            return None
        return self._items[-1]

    @property
    def is_empty(self) -> bool:
        return not self._items

    def get(self, key: str) -> Optional[Item[TItemData]]:
        if self._mapping is not None:
            return self._mapping.get(key)
        for item in self._items:
            if key == item.key:
                return item
        return None

    def push(self, item: Item[TItemData]) -> None:
        if self.get(item.key) is not None:
            raise ValueError(f"item '{item.key}' already exists")
        self._items.append(item)
        if self._mapping is not None:
            self._mapping[item.key] = item

    def remove(self, key: str) -> Optional[Item[TItemData]]:
        if self._mapping is None:
            for i, item in enumerate(self._items):
                if key == item.key:
                    self._items.pop(i)
                    return item
            return None
        item = self._mapping.pop(key, None)  # type: ignore
        if item is not None:
            for i, _item in enumerate(self._items):
                if key == _item.key:
                    self._items.pop(i)
                    break
        return item
