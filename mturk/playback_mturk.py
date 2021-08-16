import json

from tianshou.env import create_video


# filename = get_savepath(args.video_file, args.trial_id, args.layout)
filename = './replayvideo'
framerate = 5
vid_scale = 5

    env = make_overcooked_env(args)

    if args.video_file:
        env.precompute_rendering()

    num_agents = env.num_agents
    env.print_render_states = args.print_render_states

    # seed
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)

    # Keys to log.
    log_keys = ['rew']

    # Setup the benchmark loggers.
    _, _, benchmark_logger = utils.get_benchmark_logger(args, env)

    # Policy
    policy, n_steps = build_replay_policy(args.device,
                                          num_agents,
                                          trial_num=args.trial_id)
    print("Running for {} steps".format(n_steps))
    args.num_steps = n_steps - 1
    args.horizon = n_steps - 1

    # Change max steps for a longer visualization

    collector = Collector(policy,
                          env,
                          num_agents=num_agents,
                          benchmark_logger=benchmark_logger)

    all_subgoal_seed_results = {}

    for s in range(args.num_seeds):
        curr_seed = args.seed + s
        np.random.seed(curr_seed)
        torch.manual_seed(curr_seed)
        print("Using seed {}".format(curr_seed))

        all_subgoal_seed_results[curr_seed] = {}

        for i in range(args.num_render):
            collector.reset()

            # Second to last directory, since last directory is a particular epoch's checkpoint directory
            exp_name = "replay"
            render_params = {
                "start": args.start_step,
                "end": args.start_step + args.num_steps,
                "visualize_visitation": args.visualize_visitation,
                "visualize_action_entropy": args.visualize_action_entropy,
                "title": "Run {}, Seed {}".format(i, curr_seed),
                "exp_name": exp_name
            }

            if args.video_file:
                render_mode = 'overcooked_rgb_array'
            else:
                render_mode = 'overcooked_json'
            result = collector.collect(n_episode=1,
                                       render=args.render,
                                       render_mode=render_mode,
                                       render_params=render_params)

            for k in log_keys:
                print(f'{k}: {result[k]}')
            all_subgoal_seed_results[curr_seed][i] = result

            if args.json_file:
                filename = args.json_file.replace('.json',
                                                  '_subgoal%d.json' % i)
                save_json_trajectory(result, args.layout, filename, None)

    if args.task == "overcooked" and args.video_file:

        filename = get_savepath(args.video_file, args.trial_id, args.layout)

        all_frames = []

        for subgoal_i in range(args.num_render):

            for seed in all_subgoal_seed_results.keys():
                result = all_subgoal_seed_results[seed][subgoal_i]
                all_frames += result['frames']
        create_video(all_frames,
                     filename,
                     args.framerate,
                     scale=args.vid_scale)

    if args.save_benchmark_data:
        filename = get_savepath(args.video_file,
                                args.trial_id,
                                args.layout,
                                ext="json")
        with open(filename, 'w') as outfile:
            json.dump(benchmark_logger.total_infos, outfile)

    # at this point, benchmark_logger.total_infos contains summary info for the
    # whole episode.
    # that should be sufficient to get overall summary statistics

    collector.close()


create_video(all_frames, filename, framerate, scale=vid_scale)

if args.save_benchmark_data:
  filename = get_savepath(args.video_file,
                          args.trial_id,
                          args.layout,
                          ext="json")
  with open(filename, 'w') as outfile:
      json.dump(benchmark_logger.total_infos, outfile)


