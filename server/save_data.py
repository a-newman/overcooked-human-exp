import json
import os
from abc import ABC, abstractmethod
from typing import Dict, List, Union


class DataSaveError(Exception):
    pass


def get_data_saver(data_config):
    storage_method = data_config.get("storage_method", "")

    if storage_method == "save_to_file":
        return FileSaver(data_config)
    else:
        raise RuntimeError(
            "{} is not a valid data storage method".format(storage_method))


class DataSaver(ABC):
    @abstractmethod
    def __init__(self, config: Dict[str, str], *args, **kwargs):
        pass

    @abstractmethod
    def save(self, trial_id: str, data: Union[Dict, List]):
        pass


class FileSaver(DataSaver):
    def __init__(self, data_storage_config):
        self.config = data_storage_config
        self.savedir = self.config['save_directory']
        assert os.path.exists(self.savedir)

    def save(self, trial_id: str, data: Union[Dict, List]):
        savepath = os.path.join(self.savedir, "{}.json".format(trial_id))
        print("Saving data to: {}".format(savepath))
        with open(savepath, 'w') as outfile:
            json.dump(data, outfile)
