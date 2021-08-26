import sys

sys.path.append('multiagent')

import json
import os

import numpy as np
from models.utils import get_policy
from tianshou.data import Batch, Dict2Obj
from tianshou.env.overcooked.action import Action
from tianshou.policy import MetaRLPolicy, MultiAgentPolicy, ProdMetaRLPolicy
from utils import load_train_args_from_file


def load_policy(model_id, player_idx, agent_dir):

    # TODO: figure out a cleaner way to select the epoch
    logdir = os.path.join(agent_dir, model_id, "best")

    if not os.path.exists(logdir):
        # raise RuntimeError(
        #     "Could not find agent checkpoint at path {}".format(logdir))

        return None

    args_path = os.path.join(logdir, "..", "args.json")

    # Get training params
    train_params = load_train_args_from_file(args_path)
    # avoids trying to load a bc ckpt with sac_v_bc models
    train_params.do_not_load_bc_model = True
    train_params.device = 'cpu'
    num_agents = 2

    # Get the policy
    policy, _ = get_policy(train_params.policy)(train_params, num_agents)

    # Load policy and set to eval
    policy.load(logdir)
    policy.eval()

    if isinstance(policy, MultiAgentPolicy):
        # Multi agent policy, so just grab the one corresponding to the first index
        # TODO: is this the behavior we want?
        policy = policy.policies[0]

    # if the policy is a Meta-RL policy, we need to wrap it so it can store its
    # own data

    if isinstance(policy, MetaRLPolicy):
        policy = ProdMetaRLPolicy(policy, buffer_size=2000)

    policy.idx = player_idx

    return policy


def reset_policy(policy):
    pass


def use_policy(game, state, policy):

    # Convert OvercookedState to array that policy can understand
    def state_to_array(state):
        state_array = game.mdp.lossless_state_encoding(state,
                                                       pytorch_order=True)
        # import pdb; pdb.set_trace()
        player_array = np.expand_dims(state_array[policy.idx], axis=0)

        return player_array

    batch = Batch(obs=state_to_array(state), info=None)

    result = policy(batch)

    overcooked_action = Action.INDEX_TO_ACTION[result.act.item()]

    return overcooked_action
