{
	"patcher": {
		"fileversion": 1,
		"appversion": {
			"major": 8,
			"minor": 5,
			"revision": 5,
			"architecture": "x64",
			"modernui": 1
		},
		"classnamespace": "box",
		"rect": [
			60,
			100,
			1600,
			900
		],
		"openrect": [
			0.0,
			0.0,
			0.0,
			169.0
		],
		"bglocked": 0,
		"openinpresentation": 1,
		"default_fontsize": 10.0,
		"default_fontface": 0,
		"default_fontname": "Arial Bold",
		"gridonopen": 1,
		"gridsize": [
			8.0,
			8.0
		],
		"gridsnaponopen": 1,
		"objectsnaponopen": 1,
		"statusbarvisible": 2,
		"toolbarvisible": 1,
		"boxanimatetime": 500,
		"enablehscroll": 1,
		"enablevscroll": 1,
		"devicewidth": 0.0,
		"description": "",
		"digest": "",
		"tags": "",
		"style": "",
		"subpatcher_template": "",
		"boxes": [
			{
				"box": {
					"id": "obj-1",
					"maxclass": "newobj",
					"numinlets": 11,
					"numoutlets": 31,
					"patching_rect": [
						20,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal",
						"signal"
					],
					"text": "gen~ @frkf ---frkf",
					"patcher": {
						"fileversion": 1,
						"appversion": {
							"major": 8,
							"minor": 5,
							"revision": 5,
							"architecture": "x64",
							"modernui": 1
						},
						"classnamespace": "dsp.gen",
						"rect": [
							80,
							100,
							1000,
							800
						],
						"boxes": [
							{
								"box": {
									"id": "in-0",
									"maxclass": "newobj",
									"text": "in 1",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										20,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "in-1",
									"maxclass": "newobj",
									"text": "in 2",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										80,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "in-2",
									"maxclass": "newobj",
									"text": "in 3",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										140,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "in-3",
									"maxclass": "newobj",
									"text": "in 4",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										200,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "in-4",
									"maxclass": "newobj",
									"text": "in 5",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										260,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "in-5",
									"maxclass": "newobj",
									"text": "in 6",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										320,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "in-6",
									"maxclass": "newobj",
									"text": "in 7",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										380,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "in-7",
									"maxclass": "newobj",
									"text": "in 8",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										440,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "in-8",
									"maxclass": "newobj",
									"text": "in 9",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										500,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "in-9",
									"maxclass": "newobj",
									"text": "in 10",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										560,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "in-10",
									"maxclass": "newobj",
									"text": "in 11",
									"numinlets": 0,
									"numoutlets": 1,
									"outlettype": [
										""
									],
									"patching_rect": [
										620,
										20,
										40,
										22
									]
								}
							},
							{
								"box": {
									"id": "code",
									"maxclass": "codebox",
									"code": "// Keyframes - gen~ core.\n//\n// A port of the Mutable Instruments Frames firmware (keyframer.cc, poly_lfo.cc,\n// frames.cc), Copyright 2013 Emilie Gillet, released under the MIT license.\n// See LICENSE-frames.txt next to this file.\n//\n// Keyframes live in the buffer~ \"frkf\" so the patch can save them with the Live\n// set: [0] = keyframe count, [1] = id counter, then 6 values per keyframe:\n// timestamp (0..65535), id, and four levels (0..65535).\n//\n// This file is also run by tests/test_core.js, so it sticks to a subset of\n// GenExpr that is valid JavaScript once the declarations are stripped: every\n// variable is assigned before it is read, and a History is read only at the\n// top of the sample and written only at the bottom.\n\nbounce(b_t) {\n\tb_r = 0;\n\tb_u = 0;\n\tif (b_t < 0.363636363636) {\n\t\tb_r = 7.5625 * b_t * b_t;\n\t} else if (b_t < 0.727272727273) {\n\t\tb_u = b_t - 0.545454545455;\n\t\tb_r = 7.5625 * b_u * b_u + 0.75;\n\t} else if (b_t < 0.909090909091) {\n\t\tb_u = b_t - 0.818181818182;\n\t\tb_r = 7.5625 * b_u * b_u + 0.9375;\n\t} else {\n\t\tb_u = b_t - 0.954545454545;\n\t\tb_r = 7.5625 * b_u * b_u + 0.984375;\n\t}\n\treturn b_r;\n}\n\n// The six interpolation curves: step, linear, accelerating, decelerating,\n// smooth, bouncing.\nease(e_t, e_curve) {\n\te_s = e_t;\n\te_q = 0;\n\tif (e_curve < 0.5) {\n\t\te_s = 0;\n\t\tif (e_t >= 0.5) {\n\t\t\te_s = 1;\n\t\t}\n\t} else if (e_curve < 1.5) {\n\t\te_s = e_t;\n\t} else if (e_curve < 2.5) {\n\t\te_s = e_t * e_t * e_t * e_t;\n\t} else if (e_curve < 3.5) {\n\t\te_q = 1 - e_t;\n\t\te_s = 1 - e_q * e_q * e_q * e_q;\n\t} else if (e_curve < 4.5) {\n\t\te_s = 0.5 - 0.5 * cos(e_t * pi);\n\t} else {\n\t\te_s = bounce(e_t);\n\t}\n\treturn e_s;\n}\n\n// Level (0..1) to VCA gain. The hardware drives a 2164 VCA whose control is\n// exponential (-75 dB over the DAC range); \"linear\" goes through a table that\n// undoes that. The response setting blends the two control codes.\nvcagain(g_l, g_bal) {\n\tg_lc = 1;\n\tif (g_l > 0.000244140625) {\n\t\tg_lc = clamp(log(g_l) / -8.634694, 0, 1);\n\t}\n\tg_c = g_lc + ((1 - g_l) - g_lc) * g_bal;\n\treturn exp(-8.634694 * g_c) * min(1, g_l * 4096);\n}\n\n// One point of a Poly LFO wavetable before it is normalised. Tables 12\n// (stepped triangle) and 16 (random) are built in the main code.\nrawwave(w_w, w_i) {\n\tw_t = w_i / 256;\n\tw_tri = 2 * w_t;\n\tif (w_t >= 0.5) {\n\t\tw_tri = 2 - 2 * w_t;\n\t}\n\tw_sin = sin(2 * pi * w_t);\n\tw_rev = (255 - w_i) / 256;\n\tw_v = 0;\n\tw_j = 0;\n\tw_f = 0;\n\tif (w_w == 0) {\n\t\tw_v = w_t * w_t * w_t * w_t;\n\t} else if (w_w == 1) {\n\t\tw_v = w_t;\n\t} else if (w_w == 2) {\n\t\tw_v = w_tri;\n\t} else if (w_w == 3) {\n\t\tw_v = w_rev;\n\t} else if (w_w == 4) {\n\t\tw_v = w_rev * w_rev * w_rev * w_rev;\n\t} else if (w_w == 5) {\n\t\tw_v = max(w_sin, 0) * (1 - cos(4 * pi * w_t)) * 0.5;\n\t} else if (w_w == 6) {\n\t\tif (w_t < 0.5) {\n\t\t\tw_v = 1;\n\t\t}\n\t} else if (w_w == 7) {\n\t\tw_v = w_sin * w_sin * w_sin;\n\t} else if (w_w == 8) {\n\t\tw_v = w_sin;\n\t} else if (w_w == 9) {\n\t\tw_v = w_sin + 0.7 * sin(4 * pi * w_t);\n\t} else if (w_w == 10) {\n\t\tw_v = w_sin + 0.7 * sin(6 * pi * w_t);\n\t} else if (w_w == 11) {\n\t\tw_v = w_sin + 0.7 * sin(10 * pi * w_t);\n\t} else if (w_w == 13 || w_w == 14) {\n\t\tw_j = w_i + 128;\n\t\tif (w_j >= 256) {\n\t\t\tw_j = w_j - 256;\n\t\t}\n\t\tw_f = 2 * w_j / 256;\n\t\tif (w_j >= 128) {\n\t\t\tw_f = 2 - 2 * w_j / 256;\n\t\t}\n\t\tw_f = 2 * w_f - 1;\n\t\tif (w_w == 13) {\n\t\t\tw_f = 2 * w_f;\n\t\t} else {\n\t\t\tw_f = 1.5 * w_f;\n\t\t}\n\t\tif (w_f > 1) {\n\t\t\tw_f = 2 - w_f;\n\t\t}\n\t\tif (w_f < -1) {\n\t\t\tw_f = -2 - w_f;\n\t\t}\n\t\tw_v = 0 - w_f;\n\t} else if (w_w == 15) {\n\t\tw_v = pow(2, 4 * w_tri) - 1;\n\t} else if (w_w == 17) {\n\t\tw_v = w_sin;\n\t}\n\treturn w_v;\n}\n\nBuffer frkf(\"frkf\");\nData wt(4626);\nData pal(24);\nData rbw(51);\nData cvs(4);\nData rsp(4);\nData lvl(4);\nData lph(4);\nData lval(4);\nData lsn(4);\nData gsm(4);\n\nParam pframe(0, min=0, max=100);\nParam plv1(0, min=0, max=100);\nParam plv2(0, min=0, max=100);\nParam plv3(0, min=0, max=100);\nParam plv4(0, min=0, max=100);\nParam pev1(0);\nParam pev2(0);\nParam pev3(0);\nParam pev4(0);\nParam padd(0);\nParam pdel(0);\nParam pclr(0);\nParam pstep(0);\nParam pkeysel(0, min=0, max=64);\nParam pkeyev(0);\nParam pmode(0, min=0, max=2);\nParam pdiv(0, min=0, max=6);\nParam pcv1(1, min=0, max=5);\nParam pcv2(1, min=0, max=5);\nParam pcv3(1, min=0, max=5);\nParam pcv4(1, min=0, max=5);\nParam prs1(0, min=0, max=100);\nParam prs2(0, min=0, max=100);\nParam prs3(0, min=0, max=100);\nParam prs4(0, min=0, max=100);\nParam pshape(0, min=0, max=100);\nParam pshspr(0, min=-100, max=100);\nParam pspread(0, min=-100, max=100);\nParam pcoup(0, min=-100, max=100);\nParam pmx1(1, min=0, max=1);\nParam pmx2(1, min=0, max=1);\nParam pmx3(1, min=0, max=1);\nParam pmx4(1, min=0, max=1);\n\nHistory h_inited(0);\nHistory h_add(0);\nHistory h_del(0);\nHistory h_clr(0);\nHistory h_step(0);\nHistory h_ev1(0);\nHistory h_ev2(0);\nHistory h_ev3(0);\nHistory h_ev4(0);\nHistory h_keyev(0);\nHistory h_seq(0);\nHistory h_si(-1);\nHistory h_bph(0);\nHistory h_sframe(0);\nHistory h_ppos(-2);\nHistory h_pnear(-2);\nHistory h_canfire(0);\nHistory h_pulse(0);\nHistory h_rev(0);\nHistory h_js(0);\nHistory h_jt(0);\n\n// gen~ only sees a variable that is first assigned at the top level, not\n// one first assigned inside an if or a for, so every variable is declared\n// here. tests/test_build.py checks that this stays true.\nact = 0;\nav1 = 0;\nav2 = 0;\nav3 = 0;\nav4 = 0;\nba = 0;\nc1l = 0;\nc1r = 0;\nc2l = 0;\nc2r = 0;\nc3l = 0;\nc3r = 0;\nc4l = 0;\nc4r = 0;\ncanedit = 0;\ncanfire = 0;\ncb = 0;\ncc = 0;\nce0 = 0;\ncg = 0;\ncnt = 0;\ncpl = 0;\ncr = 0;\ndd = 0;\ndst = 0;\nefr = 0;\neidx = 0;\nfa = 0;\nfb = 0;\nff = 0;\nfsp = 0;\ng1 = 0;\ng2 = 0;\ng3 = 0;\ng4 = 0;\ngk = 0;\ngl0 = 0;\ngs0 = 0;\nidc = 0;\nii = 0;\njser = 0;\njt0 = 0;\njtgt = 0;\nkk = 0;\nknear = 0;\nkpos = 0;\nksel = 0;\nkts = 0;\nkv1 = 0;\nkv2 = 0;\nkv3 = 0;\nkv4 = 0;\nlfc = 0;\nlp = 0;\nlp0 = 0;\nls0 = 0;\nlv0 = 0;\nnb = 0;\nnk0 = 0;\nnkf = 0;\npa0 = 0;\npb0 = 0;\npf = 0;\npi0 = 0;\npid = 0;\npp = 0;\npulse = 0;\nqid = 0;\nra0 = 0;\nrb0 = 0;\nrev = 0;\nrf = 0;\nri = 0;\nridx = 0;\nrs0 = 0;\ns0 = 0;\ns1 = 0;\nsa = 0;\nsb = 0;\nsfr = 0;\nsi = 0;\nsq = 0;\nsrc = 0;\nstrig = 0;\nta = 0;\ntb0 = 0;\ntf = 0;\ntn0 = 0;\ntnext = 0;\ntp0 = 0;\ntrg = 0;\nts0 = 0;\ntsa = 0;\ntt = 0;\ntthis = 0;\nucp = 0;\nufr = 0;\nuidx = 0;\nusp = 0;\nva = 0;\nvb = 0;\nvs = 0;\nwa0 = 0;\nwacc = 0;\nwb0 = 0;\nwd = 0;\nwi = 0;\nwmn = 0;\nwmx = 0;\nwq = 0;\nwr = 0;\nwsp = 0;\nwv = 0;\nww = 0;\n\n// ---------------------------------------------------------------- tables\nif (h_inited == 0) {\n\t// Keyframe colours.\n\tpoke(pal, 255, 0); poke(pal, 0, 1); poke(pal, 0, 2);\n\tpoke(pal, 255, 3); poke(pal, 64, 4); poke(pal, 0, 5);\n\tpoke(pal, 255, 6); poke(pal, 255, 7); poke(pal, 0, 8);\n\tpoke(pal, 64, 9); poke(pal, 255, 10); poke(pal, 0, 11);\n\tpoke(pal, 0, 12); poke(pal, 255, 13); poke(pal, 64, 14);\n\tpoke(pal, 0, 15); poke(pal, 0, 16); poke(pal, 255, 17);\n\tpoke(pal, 255, 18); poke(pal, 0, 19); poke(pal, 255, 20);\n\tpoke(pal, 255, 21); poke(pal, 0, 22); poke(pal, 64, 23);\n\t// Poly LFO rate colours.\n\tpoke(rbw, 255, 0); poke(rbw, 0, 1); poke(rbw, 0, 2);\n\tpoke(rbw, 255, 3); poke(rbw, 32, 4); poke(rbw, 0, 5);\n\tpoke(rbw, 255, 6); poke(rbw, 192, 7); poke(rbw, 0, 8);\n\tpoke(rbw, 255, 9); poke(rbw, 240, 10); poke(rbw, 0, 11);\n\tpoke(rbw, 240, 12); poke(rbw, 255, 13); poke(rbw, 0, 14);\n\tpoke(rbw, 192, 15); poke(rbw, 255, 16); poke(rbw, 0, 17);\n\tpoke(rbw, 32, 18); poke(rbw, 255, 19); poke(rbw, 0, 20);\n\tpoke(rbw, 0, 21); poke(rbw, 255, 22); poke(rbw, 0, 23);\n\tpoke(rbw, 0, 24); poke(rbw, 255, 25); poke(rbw, 32, 26);\n\tpoke(rbw, 0, 27); poke(rbw, 255, 28); poke(rbw, 192, 29);\n\tpoke(rbw, 0, 30); poke(rbw, 255, 31); poke(rbw, 255, 32);\n\tpoke(rbw, 0, 33); poke(rbw, 192, 34); poke(rbw, 255, 35);\n\tpoke(rbw, 0, 36); poke(rbw, 32, 37); poke(rbw, 255, 38);\n\tpoke(rbw, 0, 39); poke(rbw, 0, 40); poke(rbw, 255, 41);\n\tpoke(rbw, 32, 42); poke(rbw, 0, 43); poke(rbw, 255, 44);\n\tpoke(rbw, 192, 45); poke(rbw, 0, 46); poke(rbw, 192, 47);\n\tpoke(rbw, 255, 48); poke(rbw, 0, 49); poke(rbw, 128, 50);\n\t// The firmware's \"random\" wavetable (numpy, seed 999).\n\tpoke(wt, 205, 4112); poke(wt, 134, 4113); poke(wt, 30, 4114); poke(wt, 163, 4115); poke(wt, 23, 4116); poke(wt, 84, 4117); poke(wt, 109, 4118); poke(wt, 141, 4119);\n\tpoke(wt, 160, 4120); poke(wt, 178, 4121); poke(wt, 202, 4122); poke(wt, 33, 4123); poke(wt, 87, 4124); poke(wt, 51, 4125); poke(wt, 180, 4126); poke(wt, 8, 4127);\n\tpoke(wt, 232, 4128); poke(wt, 103, 4129); poke(wt, 194, 4130); poke(wt, 121, 4131); poke(wt, 73, 4132); poke(wt, 192, 4133); poke(wt, 24, 4134); poke(wt, 105, 4135);\n\tpoke(wt, 72, 4136); poke(wt, 99, 4137); poke(wt, 222, 4138); poke(wt, 20, 4139); poke(wt, 142, 4140); poke(wt, 140, 4141); poke(wt, 84, 4142); poke(wt, 248, 4143);\n\tpoke(wt, 73, 4144); poke(wt, 130, 4145); poke(wt, 37, 4146); poke(wt, 50, 4147); poke(wt, 215, 4148); poke(wt, 1, 4149); poke(wt, 200, 4150); poke(wt, 213, 4151);\n\tpoke(wt, 239, 4152); poke(wt, 248, 4153); poke(wt, 212, 4154); poke(wt, 16, 4155); poke(wt, 103, 4156); poke(wt, 95, 4157); poke(wt, 129, 4158); poke(wt, 250, 4159);\n\tpoke(wt, 209, 4160); poke(wt, 48, 4161); poke(wt, 178, 4162); poke(wt, 174, 4163); poke(wt, 255, 4164); poke(wt, 123, 4165); poke(wt, 186, 4166); poke(wt, 203, 4167);\n\tpoke(wt, 66, 4168); poke(wt, 41, 4169); poke(wt, 178, 4170); poke(wt, 230, 4171); poke(wt, 234, 4172); poke(wt, 79, 4173); poke(wt, 244, 4174); poke(wt, 185, 4175);\n\tpoke(wt, 5, 4176); poke(wt, 185, 4177); poke(wt, 148, 4178); poke(wt, 244, 4179); poke(wt, 189, 4180); poke(wt, 50, 4181); poke(wt, 242, 4182); poke(wt, 219, 4183);\n\tpoke(wt, 114, 4184); poke(wt, 210, 4185); poke(wt, 255, 4186); poke(wt, 144, 4187); poke(wt, 150, 4188); poke(wt, 108, 4189); poke(wt, 229, 4190); poke(wt, 113, 4191);\n\tpoke(wt, 147, 4192); poke(wt, 168, 4193); poke(wt, 77, 4194); poke(wt, 5, 4195); poke(wt, 214, 4196); poke(wt, 81, 4197); poke(wt, 96, 4198); poke(wt, 46, 4199);\n\tpoke(wt, 212, 4200); poke(wt, 47, 4201); poke(wt, 247, 4202); poke(wt, 178, 4203); poke(wt, 154, 4204); poke(wt, 126, 4205); poke(wt, 181, 4206); poke(wt, 66, 4207);\n\tpoke(wt, 166, 4208); poke(wt, 159, 4209); poke(wt, 213, 4210); poke(wt, 91, 4211); poke(wt, 244, 4212); poke(wt, 16, 4213); poke(wt, 221, 4214); poke(wt, 141, 4215);\n\tpoke(wt, 227, 4216); poke(wt, 191, 4217); poke(wt, 53, 4218); poke(wt, 124, 4219); poke(wt, 151, 4220); poke(wt, 222, 4221); poke(wt, 204, 4222); poke(wt, 244, 4223);\n\tpoke(wt, 44, 4224); poke(wt, 27, 4225); poke(wt, 160, 4226); poke(wt, 95, 4227); poke(wt, 166, 4228); poke(wt, 175, 4229); poke(wt, 121, 4230); poke(wt, 170, 4231);\n\tpoke(wt, 243, 4232); poke(wt, 46, 4233); poke(wt, 179, 4234); poke(wt, 114, 4235); poke(wt, 134, 4236); poke(wt, 23, 4237); poke(wt, 171, 4238); poke(wt, 233, 4239);\n\tpoke(wt, 84, 4240); poke(wt, 247, 4241); poke(wt, 44, 4242); poke(wt, 14, 4243); poke(wt, 15, 4244); poke(wt, 199, 4245); poke(wt, 144, 4246); poke(wt, 34, 4247);\n\tpoke(wt, 123, 4248); poke(wt, 168, 4249); poke(wt, 238, 4250); poke(wt, 138, 4251); poke(wt, 72, 4252); poke(wt, 55, 4253); poke(wt, 189, 4254); poke(wt, 127, 4255);\n\tpoke(wt, 42, 4256); poke(wt, 245, 4257); poke(wt, 91, 4258); poke(wt, 102, 4259); poke(wt, 175, 4260); poke(wt, 238, 4261); poke(wt, 98, 4262); poke(wt, 89, 4263);\n\tpoke(wt, 95, 4264); poke(wt, 43, 4265); poke(wt, 45, 4266); poke(wt, 164, 4267); poke(wt, 249, 4268); poke(wt, 18, 4269); poke(wt, 33, 4270); poke(wt, 209, 4271);\n\tpoke(wt, 199, 4272); poke(wt, 250, 4273); poke(wt, 53, 4274); poke(wt, 239, 4275); poke(wt, 31, 4276); poke(wt, 178, 4277); poke(wt, 233, 4278); poke(wt, 133, 4279);\n\tpoke(wt, 102, 4280); poke(wt, 197, 4281); poke(wt, 210, 4282); poke(wt, 243, 4283); poke(wt, 17, 4284); poke(wt, 49, 4285); poke(wt, 200, 4286); poke(wt, 172, 4287);\n\tpoke(wt, 69, 4288); poke(wt, 0, 4289); poke(wt, 151, 4290); poke(wt, 209, 4291); poke(wt, 117, 4292); poke(wt, 168, 4293); poke(wt, 132, 4294); poke(wt, 244, 4295);\n\tpoke(wt, 210, 4296); poke(wt, 102, 4297); poke(wt, 228, 4298); poke(wt, 68, 4299); poke(wt, 138, 4300); poke(wt, 64, 4301); poke(wt, 135, 4302); poke(wt, 124, 4303);\n\tpoke(wt, 250, 4304); poke(wt, 131, 4305); poke(wt, 77, 4306); poke(wt, 56, 4307); poke(wt, 142, 4308); poke(wt, 98, 4309); poke(wt, 218, 4310); poke(wt, 15, 4311);\n\tpoke(wt, 22, 4312); poke(wt, 128, 4313); poke(wt, 93, 4314); poke(wt, 190, 4315); poke(wt, 26, 4316); poke(wt, 245, 4317); poke(wt, 174, 4318); poke(wt, 10, 4319);\n\tpoke(wt, 21, 4320); poke(wt, 162, 4321); poke(wt, 198, 4322); poke(wt, 73, 4323); poke(wt, 76, 4324); poke(wt, 69, 4325); poke(wt, 71, 4326); poke(wt, 19, 4327);\n\tpoke(wt, 138, 4328); poke(wt, 1, 4329); poke(wt, 189, 4330); poke(wt, 215, 4331); poke(wt, 27, 4332); poke(wt, 68, 4333); poke(wt, 41, 4334); poke(wt, 143, 4335);\n\tpoke(wt, 244, 4336); poke(wt, 48, 4337); poke(wt, 239, 4338); poke(wt, 131, 4339); poke(wt, 66, 4340); poke(wt, 198, 4341); poke(wt, 87, 4342); poke(wt, 82, 4343);\n\tpoke(wt, 212, 4344); poke(wt, 57, 4345); poke(wt, 37, 4346); poke(wt, 61, 4347); poke(wt, 46, 4348); poke(wt, 68, 4349); poke(wt, 89, 4350); poke(wt, 209, 4351);\n\tpoke(wt, 80, 4352); poke(wt, 214, 4353); poke(wt, 9, 4354); poke(wt, 148, 4355); poke(wt, 151, 4356); poke(wt, 151, 4357); poke(wt, 166, 4358); poke(wt, 228, 4359);\n\tpoke(wt, 51, 4360); poke(wt, 10, 4361); poke(wt, 86, 4362); poke(wt, 144, 4363); poke(wt, 186, 4364); poke(wt, 209, 4365); poke(wt, 212, 4366); poke(wt, 28, 4367);\n\t// Build and normalise the 18 wavetables: 256 points plus a wrap point.\n\tfor (ww = 0; ww < 18; ww += 1) {\n\t\twmn = 1000000;\n\t\twmx = -1000000;\n\t\twacc = 0;\n\t\tfor (ii = 0; ii < 256; ii += 1) {\n\t\t\twv = 0;\n\t\t\tif (ww == 12) {\n\t\t\t\tif (ii > 0) {\n\t\t\t\t\twd = rawwave(10, ii) - rawwave(10, ii - 1);\n\t\t\t\t\tif (wd > 0) {\n\t\t\t\t\t\twacc = wacc + 1;\n\t\t\t\t\t} else if (wd < 0) {\n\t\t\t\t\t\twacc = wacc - 1;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\twv = wacc;\n\t\t\t} else if (ww == 16) {\n\t\t\t\twv = peek(wt, 4112 + ii);\n\t\t\t} else {\n\t\t\t\twv = rawwave(ww, ii);\n\t\t\t}\n\t\t\tpoke(wt, wv, ww * 257 + ii);\n\t\t\twmn = min(wmn, wv);\n\t\t\twmx = max(wmx, wv);\n\t\t}\n\t\tfor (ii = 0; ii < 256; ii += 1) {\n\t\t\twr = peek(wt, ww * 257 + ii);\n\t\t\twv = (wr - wmn) / (wmx - wmn);\n\t\t\t// Round half to even, as numpy does in the firmware's table script.\n\t\t\twq = floor(wv * 255 + 0.5);\n\t\t\tif (wq - wv * 255 == 0.5 && wq - 2 * floor(wq / 2) > 0.5) {\n\t\t\t\twq = wq - 1;\n\t\t\t}\n\t\t\tpoke(wt, wq / 255, ww * 257 + ii);\n\t\t}\n\t\twr = peek(wt, ww * 257);\n\t\tpoke(wt, wr, ww * 257 + 256);\n\t}\n}\n\n// ---------------------------------------------------------------- inputs\nkv1 = floor(clamp(plv1, 0, 100) * 655.35 + 0.5);\nkv2 = floor(clamp(plv2, 0, 100) * 655.35 + 0.5);\nkv3 = floor(clamp(plv3, 0, 100) * 655.35 + 0.5);\nkv4 = floor(clamp(plv4, 0, 100) * 655.35 + 0.5);\npoke(cvs, pcv1, 0);\npoke(cvs, pcv2, 1);\npoke(cvs, pcv3, 2);\npoke(cvs, pcv4, 3);\npoke(rsp, pow(clamp(prs1, 0, 100) * 0.01, 1.5), 0);\npoke(rsp, pow(clamp(prs2, 0, 100) * 0.01, 1.5), 1);\npoke(rsp, pow(clamp(prs3, 0, 100) * 0.01, 1.5), 2);\npoke(rsp, pow(clamp(prs4, 0, 100) * 0.01, 1.5), 3);\n\nnk0 = peek(frkf, 0);\nnkf = clamp(floor(nk0 + 0.5), 0, 64);\nidc = peek(frkf, 1);\nrev = h_rev;\njser = h_js;\njtgt = h_jt;\nsq = h_seq;\ncanfire = h_canfire;\npulse = h_pulse;\n\n// Position of the FRAME control, as the firmware's 16-bit timestamp.\nufr = floor(clamp(pframe, 0, 100) * 655.35 + 0.5);\n\n// Index of the first keyframe at or after the FRAME control.\nuidx = 0;\nfor (ii = 0; ii < nkf; ii += 1) {\n\tkts = peek(frkf, 2 + 6 * ii);\n\tif (kts < ufr) {\n\t\tuidx = ii + 1;\n\t}\n}\n\n// The keyframe under the FRAME control, if there is one within reach (the\n// KEYFRAME LED). This is the one the level controls edit.\nact = -1;\nif (nkf > 0) {\n\ts0 = max(uidx - 1, 0);\n\ts1 = nkf;\n\tif (uidx < nkf - 1) {\n\t\ts1 = uidx + 2;\n\t}\n\tfor (ii = s0; ii < s1; ii += 1) {\n\t\tdd = peek(frkf, 2 + 6 * ii);\n\t\tdd = dd - ufr;\n\t\tif (act < 0 && abs(dd) < 2048) {\n\t\t\tact = ii;\n\t\t}\n\t}\n}\ncanedit = pmode < 1.5;\n\n// ---------------------------------------------------------------- editing\n// ADD: a new keyframe here, holding the current level controls.\nif (padd != h_add && canedit && act < 0 && nkf < 64) {\n\tcnt = nkf - uidx;\n\tfor (kk = 0; kk < cnt; kk += 1) {\n\t\tsrc = 2 + 6 * (nkf - 1 - kk);\n\t\tfor (ff = 0; ff < 6; ff += 1) {\n\t\t\tts0 = peek(frkf, src + ff);\n\t\t\tpoke(frkf, ts0, src + 6 + ff);\n\t\t}\n\t}\n\tdst = 2 + 6 * uidx;\n\tpoke(frkf, ufr, dst);\n\tpoke(frkf, idc, dst + 1);\n\tpoke(frkf, kv1, dst + 2);\n\tpoke(frkf, kv2, dst + 3);\n\tpoke(frkf, kv3, dst + 4);\n\tpoke(frkf, kv4, dst + 5);\n\tidc = idc + 1;\n\tif (idc >= 65536) {\n\t\tidc = 0;\n\t}\n\tnkf = nkf + 1;\n\tact = uidx;\n\trev = rev + 1;\n\tpoke(frkf, nkf, 0);\n\tpoke(frkf, idc, 1);\n}\n\n// A level control moved while on a keyframe: store it there.\nif (pev1 != h_ev1 && canedit && act >= 0) {\n\tpoke(frkf, kv1, 4 + 6 * act);\n\trev = rev + 1;\n}\nif (pev2 != h_ev2 && canedit && act >= 0) {\n\tpoke(frkf, kv2, 5 + 6 * act);\n\trev = rev + 1;\n}\nif (pev3 != h_ev3 && canedit && act >= 0) {\n\tpoke(frkf, kv3, 6 + 6 * act);\n\trev = rev + 1;\n}\nif (pev4 != h_ev4 && canedit && act >= 0) {\n\tpoke(frkf, kv4, 7 + 6 * act);\n\trev = rev + 1;\n}\n\n// DEL: remove the keyframe under the FRAME control.\nif (pdel != h_del && canedit && act >= 0) {\n\tfor (ii = act; ii < nkf - 1; ii += 1) {\n\t\tsrc = 2 + 6 * (ii + 1);\n\t\tfor (ff = 0; ff < 6; ff += 1) {\n\t\t\tts0 = peek(frkf, src + ff);\n\t\t\tpoke(frkf, ts0, src - 6 + ff);\n\t\t}\n\t}\n\tnkf = nkf - 1;\n\tact = -1;\n\trev = rev + 1;\n\tpoke(frkf, nkf, 0);\n}\n\n// Clear everything.\nif (pclr != h_clr) {\n\tnkf = 0;\n\tidc = 0;\n\tact = -1;\n\trev = rev + 1;\n\tpoke(frkf, 0, 0);\n\tpoke(frkf, 0, 1);\n}\n\n// Key control: ask the patch to move FRAME onto keyframe number pkeysel.\nif (pkeyev != h_keyev) {\n\tksel = floor(pkeysel + 0.5);\n\tif (ksel >= 1 && ksel <= nkf) {\n\t\tjt0 = peek(frkf, 2 + 6 * (ksel - 1));\n\t\tjtgt = jt0 / 655.35;\n\t\tjser = jser + 1;\n\t}\n}\n\n// ---------------------------------------------------------------- sequencer\n// A step on the Seq Step control, or on each division of the transport bar\n// phasor arriving at in11.\nstrig = 0;\nif (pstep != h_step) {\n\tstrig = 1;\n}\nsi = -1;\nif (pdiv > 0.5) {\n\tsi = floor(in11 * pow(2, floor(pdiv + 0.5) - 1));\n\tif (h_si >= 0) {\n\t\tif (si != h_si || in11 < h_bph) {\n\t\t\tstrig = 1;\n\t\t}\n\t}\n}\nif (strig > 0) {\n\tsq = sq + 1;\n}\nif (sq >= nkf) {\n\tsq = 0;\n}\n\n// ---------------------------------------------------------------- frame\n// The FRAME control is smoothed a little, as in firmware 1.1.\nsfr = h_sframe + (ufr - h_sframe) * (1 - exp(-1 / (0.002 * samplerate)));\nefr = floor(sfr + 0.5);\nif (pmode > 0.5 && pmode < 1.5 && nkf > 0) {\n\tefr = peek(frkf, 2 + 6 * sq);\n}\n\ncr = 255;\ncg = 255;\ncb = 255;\nkpos = h_ppos;\nknear = h_pnear;\n\nif (pmode < 1.5) {\n\t// ------------------------------------------------------------ keyframer\n\tif (nkf < 1) {\n\t\tpoke(lvl, kv1 / 65535, 0);\n\t\tpoke(lvl, kv2 / 65535, 1);\n\t\tpoke(lvl, kv3 / 65535, 2);\n\t\tpoke(lvl, kv4 / 65535, 3);\n\t\tkpos = -1;\n\t\tknear = -1;\n\t} else {\n\t\teidx = 0;\n\t\tfor (ii = 0; ii < nkf; ii += 1) {\n\t\t\tkts = peek(frkf, 2 + 6 * ii);\n\t\t\tif (kts < efr) {\n\t\t\t\teidx = ii + 1;\n\t\t\t}\n\t\t}\n\t\tkpos = eidx;\n\t\tif (eidx == 0 || eidx == nkf) {\n\t\t\t// Before the first keyframe or after the last one.\n\t\t\tsb = 2;\n\t\t\tif (eidx > 0) {\n\t\t\t\tsb = 2 + 6 * (nkf - 1);\n\t\t\t}\n\t\t\tfor (cc = 0; cc < 4; cc += 1) {\n\t\t\t\tlv0 = peek(frkf, sb + 2 + cc);\n\t\t\t\tpoke(lvl, lv0 / 65535, cc);\n\t\t\t}\n\t\t\tpid = peek(frkf, sb + 1);\n\t\t\tpid = 3 * (pid - 8 * floor(pid / 8));\n\t\t\tcr = peek(pal, pid);\n\t\t\tcg = peek(pal, pid + 1);\n\t\t\tcb = peek(pal, pid + 2);\n\t\t} else {\n\t\t\t// Between two keyframes.\n\t\t\tsa = 2 + 6 * (eidx - 1);\n\t\t\tsb = 2 + 6 * eidx;\n\t\t\ttsa = peek(frkf, sa);\n\t\t\ttb0 = peek(frkf, sb);\n\t\t\ttt = (efr - tsa) / max(tb0 - tsa, 1);\n\t\t\tfor (cc = 0; cc < 4; cc += 1) {\n\t\t\t\tfa = peek(frkf, sa + 2 + cc);\n\t\t\t\tfb = peek(frkf, sb + 2 + cc);\n\t\t\t\tce0 = peek(cvs, cc);\n\t\t\t\tpoke(lvl, (fa + (fb - fa) * ease(tt, ce0)) / 65535, cc);\n\t\t\t}\n\t\t\tpid = peek(frkf, sa + 1);\n\t\t\tpid = 3 * (pid - 8 * floor(pid / 8));\n\t\t\tqid = peek(frkf, sb + 1);\n\t\t\tqid = 3 * (qid - 8 * floor(qid / 8));\n\t\t\tpa0 = peek(pal, pid);\n\t\t\tpb0 = peek(pal, qid);\n\t\t\tcr = pa0 + (pb0 - pa0) * tt;\n\t\t\tpa0 = peek(pal, pid + 1);\n\t\t\tpb0 = peek(pal, qid + 1);\n\t\t\tcg = pa0 + (pb0 - pa0) * tt;\n\t\t\tpa0 = peek(pal, pid + 2);\n\t\t\tpb0 = peek(pal, qid + 2);\n\t\t\tcb = pa0 + (pb0 - pa0) * tt;\n\t\t}\n\t\ttthis = efr;\n\t\tif (eidx > 0) {\n\t\t\ttp0 = peek(frkf, 2 + 6 * (eidx - 1));\n\t\t\ttthis = efr - tp0;\n\t\t}\n\t\ttnext = 65536 - efr;\n\t\tif (eidx < nkf) {\n\t\t\ttn0 = peek(frkf, 2 + 6 * eidx);\n\t\t\ttnext = tn0 - efr;\n\t\t}\n\t\tknear = eidx;\n\t\tif (tnext < tthis) {\n\t\t\tknear = eidx + 1;\n\t\t}\n\t}\n\tfor (cc = 0; cc < 4; cc += 1) {\n\t\tlv0 = peek(lvl, cc);\n\t\trs0 = peek(rsp, cc);\n\t\tpoke(lval, vcagain(lv0, rs0), cc);\n\t}\n} else {\n\t// ------------------------------------------------------------ poly LFO\n\t// FRAME is the rate: 0.013 Hz to 110 Hz.\n\tridx = sfr / 4096;\n\tri = min(floor(ridx), 15);\n\trf = ridx - ri;\n\tra0 = peek(rbw, ri * 3);\n\trb0 = peek(rbw, ri * 3 + 3);\n\tcr = ra0 + (rb0 - ra0) * rf;\n\tra0 = peek(rbw, ri * 3 + 1);\n\trb0 = peek(rbw, ri * 3 + 4);\n\tcg = ra0 + (rb0 - ra0) * rf;\n\tra0 = peek(rbw, ri * 3 + 2);\n\trb0 = peek(rbw, ri * 3 + 5);\n\tcb = ra0 + (rb0 - ra0) * rf;\n\n\tusp = clamp(pspread, -100, 100) * 0.01;\n\tif (usp >= 0) {\n\t\t// Phase spread: up to a quarter cycle between neighbours.\n\t\tlp0 = peek(lph, 0);\n\t\tlp = lp0 + 110 * pow(2, sfr / 5040 - 13) / samplerate;\n\t\tlp = lp - floor(lp);\n\t\tpoke(lph, lp, 0);\n\t\tfor (cc = 1; cc < 4; cc += 1) {\n\t\t\tlp = lp + usp * 0.25;\n\t\t\tlp = lp - floor(lp);\n\t\t\tpoke(lph, lp, cc);\n\t\t}\n\t} else {\n\t\t// Frequency spread: up to an octave between neighbours.\n\t\tfsp = (usp - 3 * usp * usp) * 0.25;\n\t\tlfc = sfr;\n\t\tfor (cc = 0; cc < 4; cc += 1) {\n\t\t\tlp0 = peek(lph, cc);\n\t\t\tlp = lp0 + 110 * pow(2, lfc / 5040 - 13) / samplerate;\n\t\t\tlp = lp - floor(lp);\n\t\t\tpoke(lph, lp, cc);\n\t\t\tlfc = lfc - 5040 * fsp;\n\t\t}\n\t}\n\n\tucp = clamp(pcoup, -100, 100) * 0.01;\n\tcpl = (ucp + 3 * ucp * abs(ucp)) * 0.25 * 0.15625;\n\twi = clamp(pshape, 0, 100) * 0.1599976;\n\twsp = clamp(pshspr, -100, 100) * 0.04;\n\tfor (cc = 0; cc < 4; cc += 1) {\n\t\t// Each LFO's phase is pushed around by its neighbour's sine.\n\t\tnb = cc + 1;\n\t\tif (cpl <= 0) {\n\t\t\tnb = cc + 3;\n\t\t}\n\t\tif (nb > 3) {\n\t\t\tnb = nb - 4;\n\t\t}\n\t\tlp0 = peek(lph, cc);\n\t\tls0 = peek(lsn, nb);\n\t\tlp = lp0 + ls0 * abs(cpl);\n\t\tlp = lp - floor(lp);\n\t\tpp = lp * 256;\n\t\tpi0 = min(floor(pp), 255);\n\t\tpf = pp - pi0;\n\t\tta = min(floor(wi), 15);\n\t\ttf = wi - ta;\n\t\tba = ta * 257 + pi0;\n\t\twa0 = peek(wt, ba);\n\t\twb0 = peek(wt, ba + 1);\n\t\tva = wa0 + (wb0 - wa0) * pf;\n\t\twa0 = peek(wt, ba + 257);\n\t\twb0 = peek(wt, ba + 258);\n\t\tvb = wa0 + (wb0 - wa0) * pf;\n\t\twa0 = peek(wt, 4369 + pi0);\n\t\twb0 = peek(wt, 4370 + pi0);\n\t\tvs = wa0 + (wb0 - wa0) * pf;\n\t\tpoke(lsn, vs * 1.9921875 - 1, cc);\n\t\tpoke(lvl, va + (vb - va) * tf, cc);\n\t\tpoke(lval, va + (vb - va) * tf, cc);\n\t\twi = wi + wsp;\n\t\twi = wi - 16 * floor(wi / 16);\n\t}\n}\n\n// ---------------------------------------------------------------- FR.STEP\n// A 1 ms pulse each time the animation crosses a keyframe.\nif (kpos != h_ppos) {\n\tif (canfire > 0) {\n\t\tpulse = floor(samplerate * 0.001);\n\t\tcanfire = 0;\n\t}\n}\nif (knear != h_pnear) {\n\tcanfire = 1;\n}\ntrg = 0;\nif (pulse > 0) {\n\ttrg = 1;\n\tpulse = pulse - 1;\n}\n\n// ---------------------------------------------------------------- VCAs\ngk = 1 - exp(-1 / (0.001 * samplerate));\nfor (cc = 0; cc < 4; cc += 1) {\n\tgs0 = peek(gsm, cc);\n\tgl0 = peek(lval, cc);\n\tpoke(gsm, gs0 + (gl0 - gs0) * gk, cc);\n}\ng1 = peek(gsm, 0);\ng2 = peek(gsm, 1);\ng3 = peek(gsm, 2);\ng4 = peek(gsm, 3);\n\n// in1/in2 is ALL; in3..in10 are the four channel inputs, added to it.\nc1l = (in1 + in3) * g1;\nc1r = (in2 + in4) * g1;\nc2l = (in1 + in5) * g2;\nc2r = (in2 + in6) * g2;\nc3l = (in1 + in7) * g3;\nc3r = (in2 + in8) * g3;\nc4l = (in1 + in9) * g4;\nc4r = (in2 + in10) * g4;\n\nout1 = c1l * pmx1 + c2l * pmx2 + c3l * pmx3 + c4l * pmx4;\nout2 = c1r * pmx1 + c2r * pmx2 + c3r * pmx3 + c4r * pmx4;\nout3 = c1l;\nout4 = c1r;\nout5 = c2l;\nout6 = c2r;\nout7 = c3l;\nout8 = c3r;\nout9 = c4l;\nout10 = c4r;\nout11 = trg;\nout12 = g1;\nout13 = g2;\nout14 = g3;\nout15 = g4;\nout16 = peek(lvl, 0);\nout17 = peek(lvl, 1);\nout18 = peek(lvl, 2);\nout19 = peek(lvl, 3);\nout20 = act + 1;\n\n// Stored levels of the keyframe under the FRAME control, for the patch to show\n// on the level controls.\nav1 = kv1;\nav2 = kv2;\nav3 = kv3;\nav4 = kv4;\nif (act >= 0) {\n\tav1 = peek(frkf, 4 + 6 * act);\n\tav2 = peek(frkf, 5 + 6 * act);\n\tav3 = peek(frkf, 6 + 6 * act);\n\tav4 = peek(frkf, 7 + 6 * act);\n}\nout21 = av1 / 655.35;\nout22 = av2 / 655.35;\nout23 = av3 / 655.35;\nout24 = av4 / 655.35;\nout25 = rev;\nout26 = jser;\nout27 = jtgt;\nout28 = cr / 255;\nout29 = cg / 255;\nout30 = cb / 255;\nout31 = nkf;\n\nh_inited = 1;\nh_add = padd;\nh_del = pdel;\nh_clr = pclr;\nh_step = pstep;\nh_ev1 = pev1;\nh_ev2 = pev2;\nh_ev3 = pev3;\nh_ev4 = pev4;\nh_keyev = pkeyev;\nh_seq = sq;\nh_si = si;\nh_bph = in11;\nh_sframe = sfr;\nh_ppos = kpos;\nh_pnear = knear;\nh_canfire = canfire;\nh_pulse = pulse;\nh_rev = rev;\nh_js = jser;\nh_jt = jtgt;\n",
									"fontface": 0,
									"fontname": "<Monospaced>",
									"fontsize": 12.0,
									"numinlets": 11,
									"numoutlets": 31,
									"outlettype": [
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										"",
										""
									],
									"patching_rect": [
										20,
										60,
										1900,
										700
									]
								}
							},
							{
								"box": {
									"id": "out-0",
									"maxclass": "newobj",
									"text": "out 1",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										20,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-1",
									"maxclass": "newobj",
									"text": "out 2",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										80,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-2",
									"maxclass": "newobj",
									"text": "out 3",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										140,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-3",
									"maxclass": "newobj",
									"text": "out 4",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										200,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-4",
									"maxclass": "newobj",
									"text": "out 5",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										260,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-5",
									"maxclass": "newobj",
									"text": "out 6",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										320,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-6",
									"maxclass": "newobj",
									"text": "out 7",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										380,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-7",
									"maxclass": "newobj",
									"text": "out 8",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										440,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-8",
									"maxclass": "newobj",
									"text": "out 9",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										500,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-9",
									"maxclass": "newobj",
									"text": "out 10",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										560,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-10",
									"maxclass": "newobj",
									"text": "out 11",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										620,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-11",
									"maxclass": "newobj",
									"text": "out 12",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										680,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-12",
									"maxclass": "newobj",
									"text": "out 13",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										740,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-13",
									"maxclass": "newobj",
									"text": "out 14",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										800,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-14",
									"maxclass": "newobj",
									"text": "out 15",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										860,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-15",
									"maxclass": "newobj",
									"text": "out 16",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										920,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-16",
									"maxclass": "newobj",
									"text": "out 17",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										980,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-17",
									"maxclass": "newobj",
									"text": "out 18",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1040,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-18",
									"maxclass": "newobj",
									"text": "out 19",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1100,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-19",
									"maxclass": "newobj",
									"text": "out 20",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1160,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-20",
									"maxclass": "newobj",
									"text": "out 21",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1220,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-21",
									"maxclass": "newobj",
									"text": "out 22",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1280,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-22",
									"maxclass": "newobj",
									"text": "out 23",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1340,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-23",
									"maxclass": "newobj",
									"text": "out 24",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1400,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-24",
									"maxclass": "newobj",
									"text": "out 25",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1460,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-25",
									"maxclass": "newobj",
									"text": "out 26",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1520,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-26",
									"maxclass": "newobj",
									"text": "out 27",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1580,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-27",
									"maxclass": "newobj",
									"text": "out 28",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1640,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-28",
									"maxclass": "newobj",
									"text": "out 29",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1700,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-29",
									"maxclass": "newobj",
									"text": "out 30",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1760,
										780,
										44,
										22
									]
								}
							},
							{
								"box": {
									"id": "out-30",
									"maxclass": "newobj",
									"text": "out 31",
									"numinlets": 1,
									"numoutlets": 0,
									"patching_rect": [
										1820,
										780,
										44,
										22
									]
								}
							}
						],
						"lines": [
							{
								"patchline": {
									"source": [
										"in-0",
										0
									],
									"destination": [
										"code",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"in-1",
										0
									],
									"destination": [
										"code",
										1
									]
								}
							},
							{
								"patchline": {
									"source": [
										"in-2",
										0
									],
									"destination": [
										"code",
										2
									]
								}
							},
							{
								"patchline": {
									"source": [
										"in-3",
										0
									],
									"destination": [
										"code",
										3
									]
								}
							},
							{
								"patchline": {
									"source": [
										"in-4",
										0
									],
									"destination": [
										"code",
										4
									]
								}
							},
							{
								"patchline": {
									"source": [
										"in-5",
										0
									],
									"destination": [
										"code",
										5
									]
								}
							},
							{
								"patchline": {
									"source": [
										"in-6",
										0
									],
									"destination": [
										"code",
										6
									]
								}
							},
							{
								"patchline": {
									"source": [
										"in-7",
										0
									],
									"destination": [
										"code",
										7
									]
								}
							},
							{
								"patchline": {
									"source": [
										"in-8",
										0
									],
									"destination": [
										"code",
										8
									]
								}
							},
							{
								"patchline": {
									"source": [
										"in-9",
										0
									],
									"destination": [
										"code",
										9
									]
								}
							},
							{
								"patchline": {
									"source": [
										"in-10",
										0
									],
									"destination": [
										"code",
										10
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										0
									],
									"destination": [
										"out-0",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										1
									],
									"destination": [
										"out-1",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										2
									],
									"destination": [
										"out-2",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										3
									],
									"destination": [
										"out-3",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										4
									],
									"destination": [
										"out-4",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										5
									],
									"destination": [
										"out-5",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										6
									],
									"destination": [
										"out-6",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										7
									],
									"destination": [
										"out-7",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										8
									],
									"destination": [
										"out-8",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										9
									],
									"destination": [
										"out-9",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										10
									],
									"destination": [
										"out-10",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										11
									],
									"destination": [
										"out-11",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										12
									],
									"destination": [
										"out-12",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										13
									],
									"destination": [
										"out-13",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										14
									],
									"destination": [
										"out-14",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										15
									],
									"destination": [
										"out-15",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										16
									],
									"destination": [
										"out-16",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										17
									],
									"destination": [
										"out-17",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										18
									],
									"destination": [
										"out-18",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										19
									],
									"destination": [
										"out-19",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										20
									],
									"destination": [
										"out-20",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										21
									],
									"destination": [
										"out-21",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										22
									],
									"destination": [
										"out-22",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										23
									],
									"destination": [
										"out-23",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										24
									],
									"destination": [
										"out-24",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										25
									],
									"destination": [
										"out-25",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										26
									],
									"destination": [
										"out-26",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										27
									],
									"destination": [
										"out-27",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										28
									],
									"destination": [
										"out-28",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										29
									],
									"destination": [
										"out-29",
										0
									]
								}
							},
							{
								"patchline": {
									"source": [
										"code",
										30
									],
									"destination": [
										"out-30",
										0
									]
								}
							}
						]
					}
				}
			},
			{
				"box": {
					"id": "obj-2",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						135,
						20,
						100,
						22
					],
					"outlettype": [
						"float",
						"bang"
					],
					"text": "buffer~ ---frkf 100 1"
				}
			},
			{
				"box": {
					"id": "obj-3",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						250,
						20,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "loadmess frkf ---frkf"
				}
			},
			{
				"box": {
					"id": "obj-4",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						365,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugin~"
				}
			},
			{
				"box": {
					"id": "obj-5",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						480,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugout~"
				}
			},
			{
				"box": {
					"id": "obj-6",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						595,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugin~ 3 4"
				}
			},
			{
				"box": {
					"id": "obj-7",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						710,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugout~ 3 4"
				}
			},
			{
				"box": {
					"id": "obj-8",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						825,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugin~ 5 6"
				}
			},
			{
				"box": {
					"id": "obj-9",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						940,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugout~ 5 6"
				}
			},
			{
				"box": {
					"id": "obj-10",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						1055,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugin~ 7 8"
				}
			},
			{
				"box": {
					"id": "obj-11",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						1170,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugout~ 7 8"
				}
			},
			{
				"box": {
					"id": "obj-12",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						1285,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugin~ 9 10"
				}
			},
			{
				"box": {
					"id": "obj-13",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						1400,
						20,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugout~ 9 10"
				}
			},
			{
				"box": {
					"id": "obj-14",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						20,
						52,
						100,
						22
					],
					"outlettype": [
						"signal",
						"signal"
					],
					"text": "plugout~ 11 12"
				}
			},
			{
				"box": {
					"id": "obj-15",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						135,
						52,
						100,
						22
					],
					"outlettype": [
						"signal"
					],
					"text": "phasor~ 1n @lock 1"
				}
			},
			{
				"box": {
					"id": "obj-16",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						20,
						122,
						100,
						22
					],
					"outlettype": [
						"bang",
						"int",
						"int"
					],
					"text": "live.thisdevice"
				}
			},
			{
				"box": {
					"id": "obj-17",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						135,
						122,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "1"
				}
			},
			{
				"box": {
					"id": "obj-18",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						250,
						122,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "delay 1000"
				}
			},
			{
				"box": {
					"id": "obj-19",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						192,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						11,
						4,
						44,
						48
					],
					"varname": "Frame",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Frame",
							"parameter_shortname": "Frame",
							"parameter_type": 0,
							"parameter_mmin": 0.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-20",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						135,
						192,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pframe"
				}
			},
			{
				"box": {
					"id": "obj-21",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						250,
						192,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						6,
						74,
						26,
						15
					],
					"varname": "Add",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Add",
							"parameter_shortname": "Add",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							]
						}
					},
					"mode": 0,
					"text": "Add",
					"texton": "Add"
				}
			},
			{
				"box": {
					"id": "obj-22",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						365,
						192,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "t b"
				}
			},
			{
				"box": {
					"id": "obj-23",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						480,
						192,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-24",
					"maxclass": "newobj",
					"numinlets": 5,
					"numoutlets": 4,
					"patching_rect": [
						595,
						192,
						100,
						22
					],
					"outlettype": [
						"int",
						"",
						"",
						"int"
					],
					"text": "counter 1 16777215"
				}
			},
			{
				"box": {
					"id": "obj-25",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						710,
						192,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend padd"
				}
			},
			{
				"box": {
					"id": "obj-26",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						825,
						192,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						34,
						74,
						26,
						15
					],
					"varname": "Delete",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Delete",
							"parameter_shortname": "Delete",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							]
						}
					},
					"mode": 0,
					"text": "Del",
					"texton": "Del"
				}
			},
			{
				"box": {
					"id": "obj-27",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						940,
						192,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "t b"
				}
			},
			{
				"box": {
					"id": "obj-28",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						192,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-29",
					"maxclass": "newobj",
					"numinlets": 5,
					"numoutlets": 4,
					"patching_rect": [
						1170,
						192,
						100,
						22
					],
					"outlettype": [
						"int",
						"",
						"",
						"int"
					],
					"text": "counter 1 16777215"
				}
			},
			{
				"box": {
					"id": "obj-30",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1285,
						192,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pdel"
				}
			},
			{
				"box": {
					"id": "obj-31",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						1400,
						192,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						6,
						128,
						26,
						15
					],
					"varname": "Seq Step",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Seq Step",
							"parameter_shortname": "Seq Step",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							]
						}
					},
					"mode": 0,
					"text": "Step",
					"texton": "Step"
				}
			},
			{
				"box": {
					"id": "obj-32",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						20,
						224,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "t b"
				}
			},
			{
				"box": {
					"id": "obj-33",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						135,
						224,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-34",
					"maxclass": "newobj",
					"numinlets": 5,
					"numoutlets": 4,
					"patching_rect": [
						250,
						224,
						100,
						22
					],
					"outlettype": [
						"int",
						"",
						"",
						"int"
					],
					"text": "counter 1 16777215"
				}
			},
			{
				"box": {
					"id": "obj-35",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						365,
						224,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pstep"
				}
			},
			{
				"box": {
					"id": "obj-36",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						480,
						224,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						34,
						128,
						26,
						15
					],
					"varname": "Clear All",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Clear All",
							"parameter_shortname": "Clear All",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							]
						}
					},
					"mode": 0,
					"text": "Clr",
					"texton": "Clr"
				}
			},
			{
				"box": {
					"id": "obj-37",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						595,
						224,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "t b"
				}
			},
			{
				"box": {
					"id": "obj-38",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						710,
						224,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-39",
					"maxclass": "newobj",
					"numinlets": 5,
					"numoutlets": 4,
					"patching_rect": [
						825,
						224,
						100,
						22
					],
					"outlettype": [
						"int",
						"",
						"",
						"int"
					],
					"text": "counter 1 16777215"
				}
			},
			{
				"box": {
					"id": "obj-40",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						940,
						224,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pclr"
				}
			},
			{
				"box": {
					"id": "obj-41",
					"maxclass": "live.menu",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						1055,
						224,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						6,
						92,
						54,
						15
					],
					"varname": "Mode",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Mode",
							"parameter_shortname": "Mode",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 2.0,
							"parameter_enum": [
								"Keyframe",
								"Sequencer",
								"Poly LFO"
							],
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-42",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						224,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pmode"
				}
			},
			{
				"box": {
					"id": "obj-43",
					"maxclass": "live.menu",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						1285,
						224,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						6,
						110,
						54,
						15
					],
					"varname": "Seq Rate",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Seq Rate",
							"parameter_shortname": "Seq Rate",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 6.0,
							"parameter_enum": [
								"Off",
								"1/1",
								"1/2",
								"1/4",
								"1/8",
								"1/16",
								"1/32"
							],
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-44",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1400,
						224,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pdiv"
				}
			},
			{
				"box": {
					"id": "obj-45",
					"maxclass": "live.numbox",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						256,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						6,
						56,
						54,
						15
					],
					"varname": "Key",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Key",
							"parameter_shortname": "Key",
							"parameter_type": 1,
							"parameter_mmin": 0.0,
							"parameter_mmax": 64.0,
							"parameter_unitstyle": 0,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-46",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						135,
						256,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang",
						"int"
					],
					"text": "t b b i"
				}
			},
			{
				"box": {
					"id": "obj-47",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						250,
						256,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pkeysel"
				}
			},
			{
				"box": {
					"id": "obj-48",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						256,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-49",
					"maxclass": "newobj",
					"numinlets": 5,
					"numoutlets": 4,
					"patching_rect": [
						480,
						256,
						100,
						22
					],
					"outlettype": [
						"int",
						"",
						"",
						"int"
					],
					"text": "counter 1 16777215"
				}
			},
			{
				"box": {
					"id": "obj-50",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						595,
						256,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pkeyev"
				}
			},
			{
				"box": {
					"id": "obj-51",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						20,
						326,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "qmetro 40 @active 1"
				}
			},
			{
				"box": {
					"id": "obj-52",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 10,
					"patching_rect": [
						135,
						326,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang",
						"bang",
						"bang",
						"bang",
						"bang",
						"bang",
						"bang",
						"bang",
						"bang"
					],
					"text": "t b b b b b b b b b b"
				}
			},
			{
				"box": {
					"id": "obj-53",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						250,
						326,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-54",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						326,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-55",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						480,
						326,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-56",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						595,
						326,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-57",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						710,
						326,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-58",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						825,
						326,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-59",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						940,
						326,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-60",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						326,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-61",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						326,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-62",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1285,
						326,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-63",
					"maxclass": "multislider",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						1400,
						326,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"presentation": 1,
					"presentation_rect": [
						272,
						130,
						94,
						32
					],
					"size": 4,
					"setminmax": [
						0.0,
						1.0
					],
					"setstyle": 1,
					"ignoreclick": 1
				}
			},
			{
				"box": {
					"id": "obj-64",
					"maxclass": "newobj",
					"numinlets": 4,
					"numoutlets": 1,
					"patching_rect": [
						20,
						358,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "pack 0. 0. 0. 0."
				}
			},
			{
				"box": {
					"id": "obj-65",
					"maxclass": "panel",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						135,
						358,
						100,
						22
					],
					"presentation": 1,
					"presentation_rect": [
						6,
						148,
						54,
						14
					],
					"mode": 0,
					"bgcolor": [
						1.0,
						1.0,
						1.0,
						1.0
					],
					"rounded": 4
				}
			},
			{
				"box": {
					"id": "obj-66",
					"maxclass": "newobj",
					"numinlets": 4,
					"numoutlets": 1,
					"patching_rect": [
						250,
						358,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "pack 0. 0. 0. 1."
				}
			},
			{
				"box": {
					"id": "obj-67",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						365,
						358,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend bgfillcolor"
				}
			},
			{
				"box": {
					"id": "obj-68",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						480,
						358,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-69",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						595,
						358,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "t b"
				}
			},
			{
				"box": {
					"id": "obj-70",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						710,
						358,
						100,
						22
					],
					"outlettype": [
						"",
						"int",
						"int"
					],
					"text": "change 0."
				}
			},
			{
				"box": {
					"id": "obj-71",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						20,
						428,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "delay 250"
				}
			},
			{
				"box": {
					"id": "obj-72",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						135,
						428,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "t b"
				}
			},
			{
				"box": {
					"id": "obj-73",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						250,
						428,
						100,
						22
					],
					"outlettype": [
						"",
						"int",
						"int"
					],
					"text": "change 0."
				}
			},
			{
				"box": {
					"id": "obj-74",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						365,
						428,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang"
					],
					"text": "t b b"
				}
			},
			{
				"box": {
					"id": "obj-75",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						480,
						428,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-76",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						595,
						428,
						100,
						22
					],
					"outlettype": [
						"float",
						"float"
					],
					"text": "t f f"
				}
			},
			{
				"box": {
					"id": "obj-77",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						710,
						428,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-78",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						825,
						428,
						100,
						22
					],
					"outlettype": [
						"int"
					],
					"text": "> 0."
				}
			},
			{
				"box": {
					"id": "obj-79",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						498,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						69,
						4,
						44,
						48
					],
					"varname": "Level 1",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Level 1",
							"parameter_shortname": "Level 1",
							"parameter_type": 0,
							"parameter_mmin": 0.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								100.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-80",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						135,
						498,
						100,
						22
					],
					"outlettype": [
						"bang",
						"float"
					],
					"text": "t b f"
				}
			},
			{
				"box": {
					"id": "obj-81",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						250,
						498,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend plv1"
				}
			},
			{
				"box": {
					"id": "obj-82",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						498,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-83",
					"maxclass": "newobj",
					"numinlets": 5,
					"numoutlets": 4,
					"patching_rect": [
						480,
						498,
						100,
						22
					],
					"outlettype": [
						"int",
						"",
						"",
						"int"
					],
					"text": "counter 1 16777215"
				}
			},
			{
				"box": {
					"id": "obj-84",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						595,
						498,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pev1"
				}
			},
			{
				"box": {
					"id": "obj-85",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						710,
						498,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-86",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						825,
						498,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-87",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						940,
						498,
						100,
						22
					],
					"outlettype": [
						"float",
						"float"
					],
					"text": "t f f"
				}
			},
			{
				"box": {
					"id": "obj-88",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						498,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend plv1"
				}
			},
			{
				"box": {
					"id": "obj-89",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						498,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-90",
					"maxclass": "live.menu",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						1285,
						498,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						68,
						56,
						46,
						15
					],
					"varname": "Curve 1",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Curve 1",
							"parameter_shortname": "Curve 1",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 5.0,
							"parameter_enum": [
								"Step",
								"Linear",
								"Accel",
								"Decel",
								"Smooth",
								"Bounce"
							],
							"parameter_initial_enable": 1,
							"parameter_initial": [
								1
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-91",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1400,
						498,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pcv1"
				}
			},
			{
				"box": {
					"id": "obj-92",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						530,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						69,
						74,
						44,
						48
					],
					"varname": "Resp 1",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Resp 1",
							"parameter_shortname": "Resp 1",
							"parameter_type": 0,
							"parameter_mmin": 0.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-93",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						135,
						530,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend prs1"
				}
			},
			{
				"box": {
					"id": "obj-94",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						250,
						530,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						272,
						110,
						22,
						15
					],
					"varname": "Mix 1",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Mix 1",
							"parameter_shortname": "Mix 1",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_initial_enable": 1,
							"parameter_initial": [
								1
							]
						}
					},
					"mode": 1,
					"text": "1",
					"texton": "1"
				}
			},
			{
				"box": {
					"id": "obj-95",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						365,
						530,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pmx1"
				}
			},
			{
				"box": {
					"id": "obj-96",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						600,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						119,
						4,
						44,
						48
					],
					"varname": "Level 2",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Level 2",
							"parameter_shortname": "Level 2",
							"parameter_type": 0,
							"parameter_mmin": 0.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-97",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						135,
						600,
						100,
						22
					],
					"outlettype": [
						"bang",
						"float"
					],
					"text": "t b f"
				}
			},
			{
				"box": {
					"id": "obj-98",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						250,
						600,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend plv2"
				}
			},
			{
				"box": {
					"id": "obj-99",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						600,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-100",
					"maxclass": "newobj",
					"numinlets": 5,
					"numoutlets": 4,
					"patching_rect": [
						480,
						600,
						100,
						22
					],
					"outlettype": [
						"int",
						"",
						"",
						"int"
					],
					"text": "counter 1 16777215"
				}
			},
			{
				"box": {
					"id": "obj-101",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						595,
						600,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pev2"
				}
			},
			{
				"box": {
					"id": "obj-102",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						710,
						600,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-103",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						825,
						600,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-104",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						940,
						600,
						100,
						22
					],
					"outlettype": [
						"float",
						"float"
					],
					"text": "t f f"
				}
			},
			{
				"box": {
					"id": "obj-105",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						600,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend plv2"
				}
			},
			{
				"box": {
					"id": "obj-106",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						600,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-107",
					"maxclass": "live.menu",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						1285,
						600,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						118,
						56,
						46,
						15
					],
					"varname": "Curve 2",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Curve 2",
							"parameter_shortname": "Curve 2",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 5.0,
							"parameter_enum": [
								"Step",
								"Linear",
								"Accel",
								"Decel",
								"Smooth",
								"Bounce"
							],
							"parameter_initial_enable": 1,
							"parameter_initial": [
								1
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-108",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1400,
						600,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pcv2"
				}
			},
			{
				"box": {
					"id": "obj-109",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						632,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						119,
						74,
						44,
						48
					],
					"varname": "Resp 2",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Resp 2",
							"parameter_shortname": "Resp 2",
							"parameter_type": 0,
							"parameter_mmin": 0.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-110",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						135,
						632,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend prs2"
				}
			},
			{
				"box": {
					"id": "obj-111",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						250,
						632,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						296,
						110,
						22,
						15
					],
					"varname": "Mix 2",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Mix 2",
							"parameter_shortname": "Mix 2",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_initial_enable": 1,
							"parameter_initial": [
								1
							]
						}
					},
					"mode": 1,
					"text": "2",
					"texton": "2"
				}
			},
			{
				"box": {
					"id": "obj-112",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						365,
						632,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pmx2"
				}
			},
			{
				"box": {
					"id": "obj-113",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						702,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						169,
						4,
						44,
						48
					],
					"varname": "Level 3",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Level 3",
							"parameter_shortname": "Level 3",
							"parameter_type": 0,
							"parameter_mmin": 0.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-114",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						135,
						702,
						100,
						22
					],
					"outlettype": [
						"bang",
						"float"
					],
					"text": "t b f"
				}
			},
			{
				"box": {
					"id": "obj-115",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						250,
						702,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend plv3"
				}
			},
			{
				"box": {
					"id": "obj-116",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						702,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-117",
					"maxclass": "newobj",
					"numinlets": 5,
					"numoutlets": 4,
					"patching_rect": [
						480,
						702,
						100,
						22
					],
					"outlettype": [
						"int",
						"",
						"",
						"int"
					],
					"text": "counter 1 16777215"
				}
			},
			{
				"box": {
					"id": "obj-118",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						595,
						702,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pev3"
				}
			},
			{
				"box": {
					"id": "obj-119",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						710,
						702,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-120",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						825,
						702,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-121",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						940,
						702,
						100,
						22
					],
					"outlettype": [
						"float",
						"float"
					],
					"text": "t f f"
				}
			},
			{
				"box": {
					"id": "obj-122",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						702,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend plv3"
				}
			},
			{
				"box": {
					"id": "obj-123",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						702,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-124",
					"maxclass": "live.menu",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						1285,
						702,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						168,
						56,
						46,
						15
					],
					"varname": "Curve 3",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Curve 3",
							"parameter_shortname": "Curve 3",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 5.0,
							"parameter_enum": [
								"Step",
								"Linear",
								"Accel",
								"Decel",
								"Smooth",
								"Bounce"
							],
							"parameter_initial_enable": 1,
							"parameter_initial": [
								1
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-125",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1400,
						702,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pcv3"
				}
			},
			{
				"box": {
					"id": "obj-126",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						734,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						169,
						74,
						44,
						48
					],
					"varname": "Resp 3",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Resp 3",
							"parameter_shortname": "Resp 3",
							"parameter_type": 0,
							"parameter_mmin": 0.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-127",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						135,
						734,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend prs3"
				}
			},
			{
				"box": {
					"id": "obj-128",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						250,
						734,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						320,
						110,
						22,
						15
					],
					"varname": "Mix 3",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Mix 3",
							"parameter_shortname": "Mix 3",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_initial_enable": 1,
							"parameter_initial": [
								1
							]
						}
					},
					"mode": 1,
					"text": "3",
					"texton": "3"
				}
			},
			{
				"box": {
					"id": "obj-129",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						365,
						734,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pmx3"
				}
			},
			{
				"box": {
					"id": "obj-130",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						804,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						219,
						4,
						44,
						48
					],
					"varname": "Level 4",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Level 4",
							"parameter_shortname": "Level 4",
							"parameter_type": 0,
							"parameter_mmin": 0.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-131",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						135,
						804,
						100,
						22
					],
					"outlettype": [
						"bang",
						"float"
					],
					"text": "t b f"
				}
			},
			{
				"box": {
					"id": "obj-132",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						250,
						804,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend plv4"
				}
			},
			{
				"box": {
					"id": "obj-133",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						804,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-134",
					"maxclass": "newobj",
					"numinlets": 5,
					"numoutlets": 4,
					"patching_rect": [
						480,
						804,
						100,
						22
					],
					"outlettype": [
						"int",
						"",
						"",
						"int"
					],
					"text": "counter 1 16777215"
				}
			},
			{
				"box": {
					"id": "obj-135",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						595,
						804,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pev4"
				}
			},
			{
				"box": {
					"id": "obj-136",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						710,
						804,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "snapshot~"
				}
			},
			{
				"box": {
					"id": "obj-137",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						825,
						804,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-138",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						940,
						804,
						100,
						22
					],
					"outlettype": [
						"float",
						"float"
					],
					"text": "t f f"
				}
			},
			{
				"box": {
					"id": "obj-139",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						804,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend plv4"
				}
			},
			{
				"box": {
					"id": "obj-140",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						804,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-141",
					"maxclass": "live.menu",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						1285,
						804,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						218,
						56,
						46,
						15
					],
					"varname": "Curve 4",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Curve 4",
							"parameter_shortname": "Curve 4",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 5.0,
							"parameter_enum": [
								"Step",
								"Linear",
								"Accel",
								"Decel",
								"Smooth",
								"Bounce"
							],
							"parameter_initial_enable": 1,
							"parameter_initial": [
								1
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-142",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1400,
						804,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pcv4"
				}
			},
			{
				"box": {
					"id": "obj-143",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						836,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						219,
						74,
						44,
						48
					],
					"varname": "Resp 4",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Resp 4",
							"parameter_shortname": "Resp 4",
							"parameter_type": 0,
							"parameter_mmin": 0.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-144",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						135,
						836,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend prs4"
				}
			},
			{
				"box": {
					"id": "obj-145",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						250,
						836,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						344,
						110,
						22,
						15
					],
					"varname": "Mix 4",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Mix 4",
							"parameter_shortname": "Mix 4",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_initial_enable": 1,
							"parameter_initial": [
								1
							]
						}
					},
					"mode": 1,
					"text": "4",
					"texton": "4"
				}
			},
			{
				"box": {
					"id": "obj-146",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						365,
						836,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pmx4"
				}
			},
			{
				"box": {
					"id": "obj-147",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						20,
						906,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						272,
						4,
						44,
						48
					],
					"varname": "Shape",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Shape",
							"parameter_shortname": "Shape",
							"parameter_type": 0,
							"parameter_mmin": 0.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-148",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						135,
						906,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pshape"
				}
			},
			{
				"box": {
					"id": "obj-149",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						250,
						906,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						320,
						4,
						44,
						48
					],
					"varname": "Shape Spread",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Shape Spread",
							"parameter_shortname": "ShSpread",
							"parameter_type": 0,
							"parameter_mmin": -100.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-150",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						365,
						906,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pshspr"
				}
			},
			{
				"box": {
					"id": "obj-151",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						480,
						906,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						272,
						56,
						44,
						48
					],
					"varname": "Spread",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Spread",
							"parameter_shortname": "Spread",
							"parameter_type": 0,
							"parameter_mmin": -100.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-152",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						595,
						906,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pspread"
				}
			},
			{
				"box": {
					"id": "obj-153",
					"maxclass": "live.dial",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						710,
						906,
						100,
						22
					],
					"outlettype": [
						"",
						"float"
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						320,
						56,
						44,
						48
					],
					"varname": "Coupling",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Coupling",
							"parameter_shortname": "Coupling",
							"parameter_type": 0,
							"parameter_mmin": -100.0,
							"parameter_mmax": 100.0,
							"parameter_unitstyle": 5,
							"parameter_initial_enable": 1,
							"parameter_initial": [
								0.0
							]
						}
					}
				}
			},
			{
				"box": {
					"id": "obj-154",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						825,
						906,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend pcoup"
				}
			},
			{
				"box": {
					"id": "obj-155",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 3,
					"patching_rect": [
						20,
						976,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang",
						"int"
					],
					"text": "uzi 386 0"
				}
			},
			{
				"box": {
					"id": "obj-156",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						135,
						976,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "t b"
				}
			},
			{
				"box": {
					"id": "obj-157",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						250,
						976,
						100,
						22
					],
					"outlettype": [
						"",
						"int",
						"int"
					],
					"text": "change 0."
				}
			},
			{
				"box": {
					"id": "obj-158",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						976,
						100,
						22
					],
					"outlettype": [
						"bang"
					],
					"text": "delay 400"
				}
			},
			{
				"box": {
					"id": "obj-159",
					"maxclass": "newobj",
					"numinlets": 3,
					"numoutlets": 1,
					"patching_rect": [
						480,
						976,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "peek~ ---frkf"
				}
			},
			{
				"box": {
					"id": "obj-160",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						595,
						976,
						100,
						22
					],
					"outlettype": [
						"int",
						"",
						"int"
					],
					"text": "t 1 l 0"
				}
			},
			{
				"box": {
					"id": "obj-161",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						710,
						976,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"text": "zl.group 386 @zlmaxsize 1024"
				}
			},
			{
				"box": {
					"id": "obj-162",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						825,
						976,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						""
					],
					"text": "pattr keyframes",
					"parameter_enable": 1,
					"varname": "keyframes",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_invisible": 1,
							"parameter_longname": "Keyframe Data",
							"parameter_shortname": "Keyframe Data",
							"parameter_type": 3
						}
					},
					"saved_object_attributes": {
						"client_rect": [
							4,
							44,
							358,
							172
						],
						"parameter_enable": 1,
						"parameter_mappable": 0,
						"storage_rect": [
							583,
							69,
							1034,
							197
						]
					}
				}
			},
			{
				"box": {
					"id": "obj-163",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						940,
						976,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate 1 1"
				}
			},
			{
				"box": {
					"id": "obj-164",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						976,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "listfunnel"
				}
			},
			{
				"box": {
					"id": "obj-165",
					"maxclass": "newobj",
					"numinlets": 3,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						976,
						100,
						22
					],
					"outlettype": [
						"float"
					],
					"text": "peek~ ---frkf"
				}
			},
			{
				"box": {
					"id": "obj-166",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						20,
						1046,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						""
					],
					"text": "live.path"
				}
			},
			{
				"box": {
					"id": "obj-167",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						135,
						1046,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "path live_set view selected_parameter"
				}
			},
			{
				"box": {
					"id": "obj-168",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						250,
						1046,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend id"
				}
			},
			{
				"box": {
					"id": "obj-169",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						365,
						1046,
						100,
						22
					],
					"outlettype": [
						"bang",
						""
					],
					"text": "sel 0"
				}
			},
			{
				"box": {
					"id": "obj-170",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						480,
						1046,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"text": "route id"
				}
			},
			{
				"box": {
					"id": "obj-171",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 0,
					"patching_rect": [
						20,
						1116,
						100,
						22
					],
					"text": "live.remote~"
				}
			},
			{
				"box": {
					"id": "obj-172",
					"maxclass": "newobj",
					"numinlets": 6,
					"numoutlets": 1,
					"patching_rect": [
						135,
						1116,
						100,
						22
					],
					"outlettype": [
						"signal"
					],
					"text": "scale~ 0. 1. 0. 1."
				}
			},
			{
				"box": {
					"id": "obj-173",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						250,
						1116,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "live.object",
					"saved_object_attributes": {
						"_persistence": 1
					}
				}
			},
			{
				"box": {
					"id": "obj-174",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						365,
						1116,
						100,
						22
					],
					"text": "-",
					"presentation": 1,
					"presentation_rect": [
						66,
						143,
						50,
						20
					],
					"fontsize": 9.0
				}
			},
			{
				"box": {
					"id": "obj-175",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						480,
						1116,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "getid"
				}
			},
			{
				"box": {
					"id": "obj-176",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 5,
					"patching_rect": [
						595,
						1116,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						"",
						"",
						""
					],
					"text": "route min max name id"
				}
			},
			{
				"box": {
					"id": "obj-177",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						710,
						1116,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-178",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						825,
						1116,
						100,
						22
					],
					"outlettype": [
						"bang",
						""
					],
					"text": "sel 0"
				}
			},
			{
				"box": {
					"id": "obj-179",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						940,
						1116,
						100,
						22
					],
					"outlettype": [
						"bang",
						"int"
					],
					"text": "t b i"
				}
			},
			{
				"box": {
					"id": "obj-180",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						1116,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend id"
				}
			},
			{
				"box": {
					"id": "obj-181",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						1116,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "get min, get max, get name"
				}
			},
			{
				"box": {
					"id": "obj-182",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						1285,
						1116,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						68,
						126,
						32,
						15
					],
					"varname": "Map 1",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Map 1",
							"parameter_shortname": "Map 1",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_invisible": 2
						}
					},
					"mode": 1,
					"text": "Map",
					"texton": "Pick"
				}
			},
			{
				"box": {
					"id": "obj-183",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1400,
						1116,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-184",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						20,
						1148,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "pipe 300"
				}
			},
			{
				"box": {
					"id": "obj-185",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 4,
					"patching_rect": [
						135,
						1148,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang",
						"bang",
						""
					],
					"text": "t b b b l"
				}
			},
			{
				"box": {
					"id": "obj-186",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						250,
						1148,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "set 0"
				}
			},
			{
				"box": {
					"id": "obj-187",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						1148,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "0"
				}
			},
			{
				"box": {
					"id": "obj-188",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						480,
						1148,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						101,
						126,
						13,
						15
					],
					"varname": "Unmap 1",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Unmap 1",
							"parameter_shortname": "Unmap 1",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_invisible": 2
						}
					},
					"mode": 0,
					"text": "x",
					"texton": "x"
				}
			},
			{
				"box": {
					"id": "obj-189",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						595,
						1148,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang"
					],
					"text": "t b b"
				}
			},
			{
				"box": {
					"id": "obj-190",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						710,
						1148,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "id 0"
				}
			},
			{
				"box": {
					"id": "obj-191",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						825,
						1148,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "set -"
				}
			},
			{
				"box": {
					"id": "obj-192",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 0,
					"patching_rect": [
						20,
						1218,
						100,
						22
					],
					"text": "live.remote~"
				}
			},
			{
				"box": {
					"id": "obj-193",
					"maxclass": "newobj",
					"numinlets": 6,
					"numoutlets": 1,
					"patching_rect": [
						135,
						1218,
						100,
						22
					],
					"outlettype": [
						"signal"
					],
					"text": "scale~ 0. 1. 0. 1."
				}
			},
			{
				"box": {
					"id": "obj-194",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						250,
						1218,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "live.object",
					"saved_object_attributes": {
						"_persistence": 1
					}
				}
			},
			{
				"box": {
					"id": "obj-195",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						365,
						1218,
						100,
						22
					],
					"text": "-",
					"presentation": 1,
					"presentation_rect": [
						116,
						143,
						50,
						20
					],
					"fontsize": 9.0
				}
			},
			{
				"box": {
					"id": "obj-196",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						480,
						1218,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "getid"
				}
			},
			{
				"box": {
					"id": "obj-197",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 5,
					"patching_rect": [
						595,
						1218,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						"",
						"",
						""
					],
					"text": "route min max name id"
				}
			},
			{
				"box": {
					"id": "obj-198",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						710,
						1218,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-199",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						825,
						1218,
						100,
						22
					],
					"outlettype": [
						"bang",
						""
					],
					"text": "sel 0"
				}
			},
			{
				"box": {
					"id": "obj-200",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						940,
						1218,
						100,
						22
					],
					"outlettype": [
						"bang",
						"int"
					],
					"text": "t b i"
				}
			},
			{
				"box": {
					"id": "obj-201",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						1218,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend id"
				}
			},
			{
				"box": {
					"id": "obj-202",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						1218,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "get min, get max, get name"
				}
			},
			{
				"box": {
					"id": "obj-203",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						1285,
						1218,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						118,
						126,
						32,
						15
					],
					"varname": "Map 2",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Map 2",
							"parameter_shortname": "Map 2",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_invisible": 2
						}
					},
					"mode": 1,
					"text": "Map",
					"texton": "Pick"
				}
			},
			{
				"box": {
					"id": "obj-204",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1400,
						1218,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-205",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						20,
						1250,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "pipe 300"
				}
			},
			{
				"box": {
					"id": "obj-206",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 4,
					"patching_rect": [
						135,
						1250,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang",
						"bang",
						""
					],
					"text": "t b b b l"
				}
			},
			{
				"box": {
					"id": "obj-207",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						250,
						1250,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "set 0"
				}
			},
			{
				"box": {
					"id": "obj-208",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						1250,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "0"
				}
			},
			{
				"box": {
					"id": "obj-209",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						480,
						1250,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						151,
						126,
						13,
						15
					],
					"varname": "Unmap 2",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Unmap 2",
							"parameter_shortname": "Unmap 2",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_invisible": 2
						}
					},
					"mode": 0,
					"text": "x",
					"texton": "x"
				}
			},
			{
				"box": {
					"id": "obj-210",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						595,
						1250,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang"
					],
					"text": "t b b"
				}
			},
			{
				"box": {
					"id": "obj-211",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						710,
						1250,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "id 0"
				}
			},
			{
				"box": {
					"id": "obj-212",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						825,
						1250,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "set -"
				}
			},
			{
				"box": {
					"id": "obj-213",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 0,
					"patching_rect": [
						20,
						1320,
						100,
						22
					],
					"text": "live.remote~"
				}
			},
			{
				"box": {
					"id": "obj-214",
					"maxclass": "newobj",
					"numinlets": 6,
					"numoutlets": 1,
					"patching_rect": [
						135,
						1320,
						100,
						22
					],
					"outlettype": [
						"signal"
					],
					"text": "scale~ 0. 1. 0. 1."
				}
			},
			{
				"box": {
					"id": "obj-215",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						250,
						1320,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "live.object",
					"saved_object_attributes": {
						"_persistence": 1
					}
				}
			},
			{
				"box": {
					"id": "obj-216",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						365,
						1320,
						100,
						22
					],
					"text": "-",
					"presentation": 1,
					"presentation_rect": [
						166,
						143,
						50,
						20
					],
					"fontsize": 9.0
				}
			},
			{
				"box": {
					"id": "obj-217",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						480,
						1320,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "getid"
				}
			},
			{
				"box": {
					"id": "obj-218",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 5,
					"patching_rect": [
						595,
						1320,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						"",
						"",
						""
					],
					"text": "route min max name id"
				}
			},
			{
				"box": {
					"id": "obj-219",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						710,
						1320,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-220",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						825,
						1320,
						100,
						22
					],
					"outlettype": [
						"bang",
						""
					],
					"text": "sel 0"
				}
			},
			{
				"box": {
					"id": "obj-221",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						940,
						1320,
						100,
						22
					],
					"outlettype": [
						"bang",
						"int"
					],
					"text": "t b i"
				}
			},
			{
				"box": {
					"id": "obj-222",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						1320,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend id"
				}
			},
			{
				"box": {
					"id": "obj-223",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						1320,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "get min, get max, get name"
				}
			},
			{
				"box": {
					"id": "obj-224",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						1285,
						1320,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						168,
						126,
						32,
						15
					],
					"varname": "Map 3",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Map 3",
							"parameter_shortname": "Map 3",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_invisible": 2
						}
					},
					"mode": 1,
					"text": "Map",
					"texton": "Pick"
				}
			},
			{
				"box": {
					"id": "obj-225",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1400,
						1320,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-226",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						20,
						1352,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "pipe 300"
				}
			},
			{
				"box": {
					"id": "obj-227",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 4,
					"patching_rect": [
						135,
						1352,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang",
						"bang",
						""
					],
					"text": "t b b b l"
				}
			},
			{
				"box": {
					"id": "obj-228",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						250,
						1352,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "set 0"
				}
			},
			{
				"box": {
					"id": "obj-229",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						1352,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "0"
				}
			},
			{
				"box": {
					"id": "obj-230",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						480,
						1352,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						201,
						126,
						13,
						15
					],
					"varname": "Unmap 3",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Unmap 3",
							"parameter_shortname": "Unmap 3",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_invisible": 2
						}
					},
					"mode": 0,
					"text": "x",
					"texton": "x"
				}
			},
			{
				"box": {
					"id": "obj-231",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						595,
						1352,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang"
					],
					"text": "t b b"
				}
			},
			{
				"box": {
					"id": "obj-232",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						710,
						1352,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "id 0"
				}
			},
			{
				"box": {
					"id": "obj-233",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						825,
						1352,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "set -"
				}
			},
			{
				"box": {
					"id": "obj-234",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 0,
					"patching_rect": [
						20,
						1422,
						100,
						22
					],
					"text": "live.remote~"
				}
			},
			{
				"box": {
					"id": "obj-235",
					"maxclass": "newobj",
					"numinlets": 6,
					"numoutlets": 1,
					"patching_rect": [
						135,
						1422,
						100,
						22
					],
					"outlettype": [
						"signal"
					],
					"text": "scale~ 0. 1. 0. 1."
				}
			},
			{
				"box": {
					"id": "obj-236",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						250,
						1422,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "live.object",
					"saved_object_attributes": {
						"_persistence": 1
					}
				}
			},
			{
				"box": {
					"id": "obj-237",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						365,
						1422,
						100,
						22
					],
					"text": "-",
					"presentation": 1,
					"presentation_rect": [
						216,
						143,
						50,
						20
					],
					"fontsize": 9.0
				}
			},
			{
				"box": {
					"id": "obj-238",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						480,
						1422,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "getid"
				}
			},
			{
				"box": {
					"id": "obj-239",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 5,
					"patching_rect": [
						595,
						1422,
						100,
						22
					],
					"outlettype": [
						"",
						"",
						"",
						"",
						""
					],
					"text": "route min max name id"
				}
			},
			{
				"box": {
					"id": "obj-240",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						710,
						1422,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-241",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						825,
						1422,
						100,
						22
					],
					"outlettype": [
						"bang",
						""
					],
					"text": "sel 0"
				}
			},
			{
				"box": {
					"id": "obj-242",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						940,
						1422,
						100,
						22
					],
					"outlettype": [
						"bang",
						"int"
					],
					"text": "t b i"
				}
			},
			{
				"box": {
					"id": "obj-243",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						1055,
						1422,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "prepend id"
				}
			},
			{
				"box": {
					"id": "obj-244",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1170,
						1422,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "get min, get max, get name"
				}
			},
			{
				"box": {
					"id": "obj-245",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						1285,
						1422,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						218,
						126,
						32,
						15
					],
					"varname": "Map 4",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Map 4",
							"parameter_shortname": "Map 4",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_invisible": 2
						}
					},
					"mode": 1,
					"text": "Map",
					"texton": "Pick"
				}
			},
			{
				"box": {
					"id": "obj-246",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						1400,
						1422,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "gate"
				}
			},
			{
				"box": {
					"id": "obj-247",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						20,
						1454,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "pipe 300"
				}
			},
			{
				"box": {
					"id": "obj-248",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 4,
					"patching_rect": [
						135,
						1454,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang",
						"bang",
						""
					],
					"text": "t b b b l"
				}
			},
			{
				"box": {
					"id": "obj-249",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						250,
						1454,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "set 0"
				}
			},
			{
				"box": {
					"id": "obj-250",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						365,
						1454,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "0"
				}
			},
			{
				"box": {
					"id": "obj-251",
					"maxclass": "live.text",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						480,
						1454,
						100,
						22
					],
					"outlettype": [
						"",
						""
					],
					"parameter_enable": 1,
					"presentation": 1,
					"presentation_rect": [
						251,
						126,
						13,
						15
					],
					"varname": "Unmap 4",
					"saved_attribute_attributes": {
						"valueof": {
							"parameter_longname": "Unmap 4",
							"parameter_shortname": "Unmap 4",
							"parameter_type": 2,
							"parameter_mmin": 0.0,
							"parameter_mmax": 1.0,
							"parameter_enum": [
								"off",
								"on"
							],
							"parameter_invisible": 2
						}
					},
					"mode": 0,
					"text": "x",
					"texton": "x"
				}
			},
			{
				"box": {
					"id": "obj-252",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						595,
						1454,
						100,
						22
					],
					"outlettype": [
						"bang",
						"bang"
					],
					"text": "t b b"
				}
			},
			{
				"box": {
					"id": "obj-253",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						710,
						1454,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "id 0"
				}
			},
			{
				"box": {
					"id": "obj-254",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						825,
						1454,
						100,
						22
					],
					"outlettype": [
						""
					],
					"text": "set -"
				}
			}
		],
		"lines": [
			{
				"patchline": {
					"source": [
						"obj-3",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-4",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-4",
						1
					],
					"destination": [
						"obj-1",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						0
					],
					"destination": [
						"obj-5",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						1
					],
					"destination": [
						"obj-5",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-6",
						0
					],
					"destination": [
						"obj-1",
						2
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-6",
						1
					],
					"destination": [
						"obj-1",
						3
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						2
					],
					"destination": [
						"obj-7",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						3
					],
					"destination": [
						"obj-7",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-8",
						0
					],
					"destination": [
						"obj-1",
						4
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-8",
						1
					],
					"destination": [
						"obj-1",
						5
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						4
					],
					"destination": [
						"obj-9",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						5
					],
					"destination": [
						"obj-9",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-10",
						0
					],
					"destination": [
						"obj-1",
						6
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-10",
						1
					],
					"destination": [
						"obj-1",
						7
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						6
					],
					"destination": [
						"obj-11",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						7
					],
					"destination": [
						"obj-11",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-12",
						0
					],
					"destination": [
						"obj-1",
						8
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-12",
						1
					],
					"destination": [
						"obj-1",
						9
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						8
					],
					"destination": [
						"obj-13",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						9
					],
					"destination": [
						"obj-13",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						10
					],
					"destination": [
						"obj-14",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						10
					],
					"destination": [
						"obj-14",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-15",
						0
					],
					"destination": [
						"obj-1",
						10
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-16",
						0
					],
					"destination": [
						"obj-18",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-18",
						0
					],
					"destination": [
						"obj-17",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-19",
						0
					],
					"destination": [
						"obj-20",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-20",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-21",
						0
					],
					"destination": [
						"obj-22",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-17",
						0
					],
					"destination": [
						"obj-23",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-22",
						0
					],
					"destination": [
						"obj-23",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-23",
						0
					],
					"destination": [
						"obj-24",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-24",
						0
					],
					"destination": [
						"obj-25",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-25",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-26",
						0
					],
					"destination": [
						"obj-27",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-17",
						0
					],
					"destination": [
						"obj-28",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-27",
						0
					],
					"destination": [
						"obj-28",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-28",
						0
					],
					"destination": [
						"obj-29",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-29",
						0
					],
					"destination": [
						"obj-30",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-30",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-31",
						0
					],
					"destination": [
						"obj-32",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-17",
						0
					],
					"destination": [
						"obj-33",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-32",
						0
					],
					"destination": [
						"obj-33",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-33",
						0
					],
					"destination": [
						"obj-34",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-34",
						0
					],
					"destination": [
						"obj-35",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-35",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-36",
						0
					],
					"destination": [
						"obj-37",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-17",
						0
					],
					"destination": [
						"obj-38",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-37",
						0
					],
					"destination": [
						"obj-38",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-38",
						0
					],
					"destination": [
						"obj-39",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-39",
						0
					],
					"destination": [
						"obj-40",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-40",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-41",
						0
					],
					"destination": [
						"obj-42",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-42",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-43",
						0
					],
					"destination": [
						"obj-44",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-44",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-45",
						0
					],
					"destination": [
						"obj-46",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-46",
						2
					],
					"destination": [
						"obj-47",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-47",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-17",
						0
					],
					"destination": [
						"obj-48",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-46",
						1
					],
					"destination": [
						"obj-48",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-48",
						0
					],
					"destination": [
						"obj-49",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-49",
						0
					],
					"destination": [
						"obj-50",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-50",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-51",
						0
					],
					"destination": [
						"obj-52",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						29
					],
					"destination": [
						"obj-53",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						9
					],
					"destination": [
						"obj-53",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						28
					],
					"destination": [
						"obj-54",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						8
					],
					"destination": [
						"obj-54",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						27
					],
					"destination": [
						"obj-55",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						7
					],
					"destination": [
						"obj-55",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						18
					],
					"destination": [
						"obj-56",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						6
					],
					"destination": [
						"obj-56",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						17
					],
					"destination": [
						"obj-57",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						5
					],
					"destination": [
						"obj-57",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						16
					],
					"destination": [
						"obj-58",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						4
					],
					"destination": [
						"obj-58",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						15
					],
					"destination": [
						"obj-59",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						3
					],
					"destination": [
						"obj-59",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						25
					],
					"destination": [
						"obj-60",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						2
					],
					"destination": [
						"obj-60",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						24
					],
					"destination": [
						"obj-61",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						1
					],
					"destination": [
						"obj-61",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						19
					],
					"destination": [
						"obj-62",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						0
					],
					"destination": [
						"obj-62",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-59",
						0
					],
					"destination": [
						"obj-64",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-58",
						0
					],
					"destination": [
						"obj-64",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-57",
						0
					],
					"destination": [
						"obj-64",
						2
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-56",
						0
					],
					"destination": [
						"obj-64",
						3
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-64",
						0
					],
					"destination": [
						"obj-63",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-55",
						0
					],
					"destination": [
						"obj-66",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-54",
						0
					],
					"destination": [
						"obj-66",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-53",
						0
					],
					"destination": [
						"obj-66",
						2
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-66",
						0
					],
					"destination": [
						"obj-67",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-67",
						0
					],
					"destination": [
						"obj-65",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						26
					],
					"destination": [
						"obj-68",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-60",
						0
					],
					"destination": [
						"obj-70",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-70",
						0
					],
					"destination": [
						"obj-69",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-69",
						0
					],
					"destination": [
						"obj-68",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-68",
						0
					],
					"destination": [
						"obj-19",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-62",
						0
					],
					"destination": [
						"obj-73",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-73",
						0
					],
					"destination": [
						"obj-72",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-72",
						0
					],
					"destination": [
						"obj-71",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-46",
						0
					],
					"destination": [
						"obj-71",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-71",
						0
					],
					"destination": [
						"obj-74",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						19
					],
					"destination": [
						"obj-75",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-74",
						1
					],
					"destination": [
						"obj-75",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-75",
						0
					],
					"destination": [
						"obj-76",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-76",
						0
					],
					"destination": [
						"obj-77",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-77",
						0
					],
					"destination": [
						"obj-45",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-76",
						1
					],
					"destination": [
						"obj-78",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-79",
						0
					],
					"destination": [
						"obj-80",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-80",
						1
					],
					"destination": [
						"obj-81",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-81",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-17",
						0
					],
					"destination": [
						"obj-82",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-80",
						0
					],
					"destination": [
						"obj-82",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-82",
						0
					],
					"destination": [
						"obj-83",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-83",
						0
					],
					"destination": [
						"obj-84",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-84",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						20
					],
					"destination": [
						"obj-85",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-74",
						0
					],
					"destination": [
						"obj-85",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-78",
						0
					],
					"destination": [
						"obj-86",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-85",
						0
					],
					"destination": [
						"obj-86",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-86",
						0
					],
					"destination": [
						"obj-87",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-87",
						1
					],
					"destination": [
						"obj-88",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-88",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-87",
						0
					],
					"destination": [
						"obj-89",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-89",
						0
					],
					"destination": [
						"obj-79",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-90",
						0
					],
					"destination": [
						"obj-91",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-91",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-92",
						0
					],
					"destination": [
						"obj-93",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-93",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-94",
						0
					],
					"destination": [
						"obj-95",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-95",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-96",
						0
					],
					"destination": [
						"obj-97",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-97",
						1
					],
					"destination": [
						"obj-98",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-98",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-17",
						0
					],
					"destination": [
						"obj-99",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-97",
						0
					],
					"destination": [
						"obj-99",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-99",
						0
					],
					"destination": [
						"obj-100",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-100",
						0
					],
					"destination": [
						"obj-101",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-101",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						21
					],
					"destination": [
						"obj-102",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-74",
						0
					],
					"destination": [
						"obj-102",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-78",
						0
					],
					"destination": [
						"obj-103",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-102",
						0
					],
					"destination": [
						"obj-103",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-103",
						0
					],
					"destination": [
						"obj-104",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-104",
						1
					],
					"destination": [
						"obj-105",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-105",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-104",
						0
					],
					"destination": [
						"obj-106",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-106",
						0
					],
					"destination": [
						"obj-96",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-107",
						0
					],
					"destination": [
						"obj-108",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-108",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-109",
						0
					],
					"destination": [
						"obj-110",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-110",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-111",
						0
					],
					"destination": [
						"obj-112",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-112",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-113",
						0
					],
					"destination": [
						"obj-114",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-114",
						1
					],
					"destination": [
						"obj-115",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-115",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-17",
						0
					],
					"destination": [
						"obj-116",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-114",
						0
					],
					"destination": [
						"obj-116",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-116",
						0
					],
					"destination": [
						"obj-117",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-117",
						0
					],
					"destination": [
						"obj-118",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-118",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						22
					],
					"destination": [
						"obj-119",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-74",
						0
					],
					"destination": [
						"obj-119",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-78",
						0
					],
					"destination": [
						"obj-120",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-119",
						0
					],
					"destination": [
						"obj-120",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-120",
						0
					],
					"destination": [
						"obj-121",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-121",
						1
					],
					"destination": [
						"obj-122",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-122",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-121",
						0
					],
					"destination": [
						"obj-123",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-123",
						0
					],
					"destination": [
						"obj-113",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-124",
						0
					],
					"destination": [
						"obj-125",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-125",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-126",
						0
					],
					"destination": [
						"obj-127",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-127",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-128",
						0
					],
					"destination": [
						"obj-129",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-129",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-130",
						0
					],
					"destination": [
						"obj-131",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-131",
						1
					],
					"destination": [
						"obj-132",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-132",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-17",
						0
					],
					"destination": [
						"obj-133",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-131",
						0
					],
					"destination": [
						"obj-133",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-133",
						0
					],
					"destination": [
						"obj-134",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-134",
						0
					],
					"destination": [
						"obj-135",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-135",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						23
					],
					"destination": [
						"obj-136",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-74",
						0
					],
					"destination": [
						"obj-136",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-78",
						0
					],
					"destination": [
						"obj-137",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-136",
						0
					],
					"destination": [
						"obj-137",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-137",
						0
					],
					"destination": [
						"obj-138",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-138",
						1
					],
					"destination": [
						"obj-139",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-139",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-138",
						0
					],
					"destination": [
						"obj-140",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-140",
						0
					],
					"destination": [
						"obj-130",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-141",
						0
					],
					"destination": [
						"obj-142",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-142",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-143",
						0
					],
					"destination": [
						"obj-144",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-144",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-145",
						0
					],
					"destination": [
						"obj-146",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-146",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-147",
						0
					],
					"destination": [
						"obj-148",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-148",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-149",
						0
					],
					"destination": [
						"obj-150",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-150",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-151",
						0
					],
					"destination": [
						"obj-152",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-152",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-153",
						0
					],
					"destination": [
						"obj-154",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-154",
						0
					],
					"destination": [
						"obj-1",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-61",
						0
					],
					"destination": [
						"obj-157",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-157",
						0
					],
					"destination": [
						"obj-156",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-156",
						0
					],
					"destination": [
						"obj-158",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-158",
						0
					],
					"destination": [
						"obj-155",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-155",
						2
					],
					"destination": [
						"obj-159",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-159",
						0
					],
					"destination": [
						"obj-161",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-161",
						0
					],
					"destination": [
						"obj-160",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-160",
						2
					],
					"destination": [
						"obj-163",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-160",
						1
					],
					"destination": [
						"obj-162",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-160",
						0
					],
					"destination": [
						"obj-163",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-162",
						0
					],
					"destination": [
						"obj-163",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-163",
						0
					],
					"destination": [
						"obj-164",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-164",
						0
					],
					"destination": [
						"obj-165",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-16",
						0
					],
					"destination": [
						"obj-167",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-167",
						0
					],
					"destination": [
						"obj-166",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-166",
						1
					],
					"destination": [
						"obj-170",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-170",
						0
					],
					"destination": [
						"obj-169",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-169",
						1
					],
					"destination": [
						"obj-168",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						11
					],
					"destination": [
						"obj-172",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-172",
						0
					],
					"destination": [
						"obj-171",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-16",
						0
					],
					"destination": [
						"obj-175",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-175",
						0
					],
					"destination": [
						"obj-173",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-173",
						0
					],
					"destination": [
						"obj-176",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-176",
						0
					],
					"destination": [
						"obj-172",
						3
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-176",
						1
					],
					"destination": [
						"obj-172",
						4
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-176",
						2
					],
					"destination": [
						"obj-177",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-177",
						0
					],
					"destination": [
						"obj-174",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-176",
						3
					],
					"destination": [
						"obj-178",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-178",
						1
					],
					"destination": [
						"obj-179",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-179",
						1
					],
					"destination": [
						"obj-180",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-180",
						0
					],
					"destination": [
						"obj-171",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-179",
						0
					],
					"destination": [
						"obj-181",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-181",
						0
					],
					"destination": [
						"obj-173",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-182",
						0
					],
					"destination": [
						"obj-184",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-184",
						0
					],
					"destination": [
						"obj-183",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-168",
						0
					],
					"destination": [
						"obj-183",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-183",
						0
					],
					"destination": [
						"obj-185",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-185",
						3
					],
					"destination": [
						"obj-173",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-185",
						2
					],
					"destination": [
						"obj-175",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-185",
						1
					],
					"destination": [
						"obj-186",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-186",
						0
					],
					"destination": [
						"obj-182",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-185",
						0
					],
					"destination": [
						"obj-187",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-187",
						0
					],
					"destination": [
						"obj-183",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-188",
						0
					],
					"destination": [
						"obj-189",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-189",
						1
					],
					"destination": [
						"obj-190",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-190",
						0
					],
					"destination": [
						"obj-171",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-190",
						0
					],
					"destination": [
						"obj-173",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-189",
						0
					],
					"destination": [
						"obj-191",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-191",
						0
					],
					"destination": [
						"obj-174",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						12
					],
					"destination": [
						"obj-193",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-193",
						0
					],
					"destination": [
						"obj-192",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-16",
						0
					],
					"destination": [
						"obj-196",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-196",
						0
					],
					"destination": [
						"obj-194",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-194",
						0
					],
					"destination": [
						"obj-197",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-197",
						0
					],
					"destination": [
						"obj-193",
						3
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-197",
						1
					],
					"destination": [
						"obj-193",
						4
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-197",
						2
					],
					"destination": [
						"obj-198",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-198",
						0
					],
					"destination": [
						"obj-195",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-197",
						3
					],
					"destination": [
						"obj-199",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-199",
						1
					],
					"destination": [
						"obj-200",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-200",
						1
					],
					"destination": [
						"obj-201",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-201",
						0
					],
					"destination": [
						"obj-192",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-200",
						0
					],
					"destination": [
						"obj-202",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-202",
						0
					],
					"destination": [
						"obj-194",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-203",
						0
					],
					"destination": [
						"obj-205",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-205",
						0
					],
					"destination": [
						"obj-204",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-168",
						0
					],
					"destination": [
						"obj-204",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-204",
						0
					],
					"destination": [
						"obj-206",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-206",
						3
					],
					"destination": [
						"obj-194",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-206",
						2
					],
					"destination": [
						"obj-196",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-206",
						1
					],
					"destination": [
						"obj-207",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-207",
						0
					],
					"destination": [
						"obj-203",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-206",
						0
					],
					"destination": [
						"obj-208",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-208",
						0
					],
					"destination": [
						"obj-204",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-209",
						0
					],
					"destination": [
						"obj-210",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-210",
						1
					],
					"destination": [
						"obj-211",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-211",
						0
					],
					"destination": [
						"obj-192",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-211",
						0
					],
					"destination": [
						"obj-194",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-210",
						0
					],
					"destination": [
						"obj-212",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-212",
						0
					],
					"destination": [
						"obj-195",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						13
					],
					"destination": [
						"obj-214",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-214",
						0
					],
					"destination": [
						"obj-213",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-16",
						0
					],
					"destination": [
						"obj-217",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-217",
						0
					],
					"destination": [
						"obj-215",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-215",
						0
					],
					"destination": [
						"obj-218",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-218",
						0
					],
					"destination": [
						"obj-214",
						3
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-218",
						1
					],
					"destination": [
						"obj-214",
						4
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-218",
						2
					],
					"destination": [
						"obj-219",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-219",
						0
					],
					"destination": [
						"obj-216",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-218",
						3
					],
					"destination": [
						"obj-220",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-220",
						1
					],
					"destination": [
						"obj-221",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-221",
						1
					],
					"destination": [
						"obj-222",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-222",
						0
					],
					"destination": [
						"obj-213",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-221",
						0
					],
					"destination": [
						"obj-223",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-223",
						0
					],
					"destination": [
						"obj-215",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-224",
						0
					],
					"destination": [
						"obj-226",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-226",
						0
					],
					"destination": [
						"obj-225",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-168",
						0
					],
					"destination": [
						"obj-225",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-225",
						0
					],
					"destination": [
						"obj-227",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-227",
						3
					],
					"destination": [
						"obj-215",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-227",
						2
					],
					"destination": [
						"obj-217",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-227",
						1
					],
					"destination": [
						"obj-228",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-228",
						0
					],
					"destination": [
						"obj-224",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-227",
						0
					],
					"destination": [
						"obj-229",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-229",
						0
					],
					"destination": [
						"obj-225",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-230",
						0
					],
					"destination": [
						"obj-231",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-231",
						1
					],
					"destination": [
						"obj-232",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-232",
						0
					],
					"destination": [
						"obj-213",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-232",
						0
					],
					"destination": [
						"obj-215",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-231",
						0
					],
					"destination": [
						"obj-233",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-233",
						0
					],
					"destination": [
						"obj-216",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-1",
						14
					],
					"destination": [
						"obj-235",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-235",
						0
					],
					"destination": [
						"obj-234",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-16",
						0
					],
					"destination": [
						"obj-238",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-238",
						0
					],
					"destination": [
						"obj-236",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-236",
						0
					],
					"destination": [
						"obj-239",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-239",
						0
					],
					"destination": [
						"obj-235",
						3
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-239",
						1
					],
					"destination": [
						"obj-235",
						4
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-239",
						2
					],
					"destination": [
						"obj-240",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-240",
						0
					],
					"destination": [
						"obj-237",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-239",
						3
					],
					"destination": [
						"obj-241",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-241",
						1
					],
					"destination": [
						"obj-242",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-242",
						1
					],
					"destination": [
						"obj-243",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-243",
						0
					],
					"destination": [
						"obj-234",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-242",
						0
					],
					"destination": [
						"obj-244",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-244",
						0
					],
					"destination": [
						"obj-236",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-245",
						0
					],
					"destination": [
						"obj-247",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-247",
						0
					],
					"destination": [
						"obj-246",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-168",
						0
					],
					"destination": [
						"obj-246",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-246",
						0
					],
					"destination": [
						"obj-248",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-248",
						3
					],
					"destination": [
						"obj-236",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-248",
						2
					],
					"destination": [
						"obj-238",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-248",
						1
					],
					"destination": [
						"obj-249",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-249",
						0
					],
					"destination": [
						"obj-245",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-248",
						0
					],
					"destination": [
						"obj-250",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-250",
						0
					],
					"destination": [
						"obj-246",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-251",
						0
					],
					"destination": [
						"obj-252",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-252",
						1
					],
					"destination": [
						"obj-253",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-253",
						0
					],
					"destination": [
						"obj-234",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-253",
						0
					],
					"destination": [
						"obj-236",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-252",
						0
					],
					"destination": [
						"obj-254",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-254",
						0
					],
					"destination": [
						"obj-237",
						0
					]
				}
			}
		],
		"parameters": {
			"obj-19": [
				"Frame",
				"Frame",
				0
			],
			"obj-21": [
				"Add",
				"Add",
				0
			],
			"obj-26": [
				"Delete",
				"Delete",
				0
			],
			"obj-31": [
				"Seq Step",
				"Seq Step",
				0
			],
			"obj-36": [
				"Clear All",
				"Clear All",
				0
			],
			"obj-41": [
				"Mode",
				"Mode",
				0
			],
			"obj-43": [
				"Seq Rate",
				"Seq Rate",
				0
			],
			"obj-45": [
				"Key",
				"Key",
				0
			],
			"obj-79": [
				"Level 1",
				"Level 1",
				0
			],
			"obj-90": [
				"Curve 1",
				"Curve 1",
				0
			],
			"obj-92": [
				"Resp 1",
				"Resp 1",
				0
			],
			"obj-94": [
				"Mix 1",
				"Mix 1",
				0
			],
			"obj-96": [
				"Level 2",
				"Level 2",
				0
			],
			"obj-107": [
				"Curve 2",
				"Curve 2",
				0
			],
			"obj-109": [
				"Resp 2",
				"Resp 2",
				0
			],
			"obj-111": [
				"Mix 2",
				"Mix 2",
				0
			],
			"obj-113": [
				"Level 3",
				"Level 3",
				0
			],
			"obj-124": [
				"Curve 3",
				"Curve 3",
				0
			],
			"obj-126": [
				"Resp 3",
				"Resp 3",
				0
			],
			"obj-128": [
				"Mix 3",
				"Mix 3",
				0
			],
			"obj-130": [
				"Level 4",
				"Level 4",
				0
			],
			"obj-141": [
				"Curve 4",
				"Curve 4",
				0
			],
			"obj-143": [
				"Resp 4",
				"Resp 4",
				0
			],
			"obj-145": [
				"Mix 4",
				"Mix 4",
				0
			],
			"obj-147": [
				"Shape",
				"Shape",
				0
			],
			"obj-149": [
				"Shape Spread",
				"ShSpread",
				0
			],
			"obj-151": [
				"Spread",
				"Spread",
				0
			],
			"obj-153": [
				"Coupling",
				"Coupling",
				0
			],
			"obj-162": [
				"Keyframe Data",
				"Keyframe Data",
				0
			],
			"obj-182": [
				"Map 1",
				"Map 1",
				0
			],
			"obj-188": [
				"Unmap 1",
				"Unmap 1",
				0
			],
			"obj-203": [
				"Map 2",
				"Map 2",
				0
			],
			"obj-209": [
				"Unmap 2",
				"Unmap 2",
				0
			],
			"obj-224": [
				"Map 3",
				"Map 3",
				0
			],
			"obj-230": [
				"Unmap 3",
				"Unmap 3",
				0
			],
			"obj-245": [
				"Map 4",
				"Map 4",
				0
			],
			"obj-251": [
				"Unmap 4",
				"Unmap 4",
				0
			],
			"parameterbanks": {
				"0": {
					"index": 0,
					"name": "Frames",
					"parameters": [
						"Frame",
						"Level 1",
						"Level 2",
						"Level 3",
						"Level 4",
						"Add",
						"Delete",
						"Key"
					]
				},
				"1": {
					"index": 1,
					"name": "Curves",
					"parameters": [
						"Curve 1",
						"Curve 2",
						"Curve 3",
						"Curve 4",
						"Resp 1",
						"Resp 2",
						"Resp 3",
						"Resp 4"
					]
				},
				"2": {
					"index": 2,
					"name": "Seq + Mix",
					"parameters": [
						"Mode",
						"Seq Rate",
						"Seq Step",
						"Clear All",
						"Mix 1",
						"Mix 2",
						"Mix 3",
						"Mix 4"
					]
				},
				"3": {
					"index": 3,
					"name": "Poly LFO",
					"parameters": [
						"Shape",
						"Shape Spread",
						"Spread",
						"Coupling",
						"-",
						"-",
						"-",
						"-"
					]
				}
			},
			"inherited_shortname": 1
		},
		"dependency_cache": [],
		"latency": 0,
		"is_mpe": 0,
		"autosave": 0
	}
}
