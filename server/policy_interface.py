import sys

sys.path.append('multiagent')

import argparse
import json
import os

import numpy as np
import torch

from models.utils import get_policy
from tianshou.data import Dict2Obj, Batch

from tianshou.env import create_video, make_multiagent_env, make_overcooked_env
from tianshou.env.overcooked.utils import save_json_trajectory


from tianshou.env.overcooked.action import Action




def load_policy(idx):

  logdir = "multiagent/sac_shaped_simple/best"
  args_path = os.path.join(logdir, "..", "args.json")

  # Get training params
  train_params = Dict2Obj(json.load(open(args_path, "r")))
  train_params.device = 'cpu'
  num_agents = 2

  # Get the policy
  policy, _ = get_policy(train_params.policy)(train_params, num_agents)

  # Load policy and set to eval
  policy.load(logdir)
  policy.eval()

  # Multi agent policy, so just grab the first one
  policy = policy.policies[0]
  
  policy.idx = idx

  return policy

def reset_policy(policy):
  pass


def use_policy(game, state, policy):

  # Convert OvercookedState to array that policy can understand
  def state_to_array(state):
    state_array = game.mdp.lossless_state_encoding(state, pytorch_order=True)
    # import pdb; pdb.set_trace()
    player_array = np.expand_dims(state_array[policy.idx], axis=0)
    return player_array
    

  batch = Batch(obs=state_to_array(state),
                info=None)


  result = policy(batch)

  overcooked_action = Action.INDEX_TO_ACTION[result.act.item()]

  return overcooked_action


