---
name: research-benchmark
description: Run hardware and software benchmarks for avatar, voice, and GPU pipelines
triggers:
  - /research-benchmark
---

# Research Benchmark — Performance Measurement

Benchmark target from args: `$ARGUMENTS`

Run targeted benchmarks and format results using the Arcanea research template. Usage: `/research-benchmark [gpu|avatar|voice|latency]`

## Startup

1. Read the benchmark template at `docs/research/templates/benchmark-report.md`
2. Determine the target from the user's argument. If none given, ask which target to benchmark.

## Benchmark Targets

### gpu — GPU Capability Assessment

Collect system GPU information:
```bash
# NVIDIA GPU info
nvidia-smi --query-gpu=name,memory.total,memory.free,compute_cap,driver_version --format=csv,noheader 2>/dev/null
nvidia-smi 2>/dev/null
# CUDA version
nvcc --version 2>/dev/null
# System info
wmic cpu get name,numberofcores,maxclockspeed 2>/dev/null
wmic memorychip get capacity 2>/dev/null
```

Record: GPU model, VRAM total/free, CUDA version, compute capability, driver version. Compare against requirements for avatar pipelines (Wav2Lip needs 4GB+, MuseTalk needs 8GB+).

### avatar — Avatar Tech Benchmark

Test available avatar generation tools:
```bash
# Check if Wav2Lip is available
python -c "import torch; print(f'PyTorch: {torch.__version__}, CUDA: {torch.cuda.is_available()}')" 2>/dev/null
# Check MuseTalk
python -c "import musetalk" 2>/dev/null && echo "MuseTalk available" || echo "MuseTalk not installed"
# Check SadTalker
python -c "import sadtalker" 2>/dev/null && echo "SadTalker available" || echo "SadTalker not installed"
```

If tools are available, run a timing test:
- Measure inference time for a single frame
- Measure VRAM usage during inference
- Note quality observations

If tools are not installed, document what is missing and provide install commands.

### voice — Voice Pipeline Latency

Test the voice processing pipeline:
```bash
# Check whisper availability
python -c "import whisper; print(f'Whisper: available')" 2>/dev/null
# Check TTS tools
python -c "import TTS; print(f'Coqui TTS: {TTS.__version__}')" 2>/dev/null
# Check edge-tts
python -c "import edge_tts; print('edge-tts: available')" 2>/dev/null
```

Measure (where tools are available):
- **STT latency**: Time to transcribe a 5-second audio clip
- **LLM response latency**: Time to generate a short response via API
- **TTS latency**: Time to synthesize speech from text
- **Total pipeline**: Sum of all stages

### latency — End-to-End Pipeline

Run a full pipeline measurement combining all stages:
1. Simulated audio input (or file-based)
2. Speech-to-text transcription
3. LLM inference (measure API call round-trip)
4. Text-to-speech synthesis
5. (If avatar available) Video generation

Measure each stage independently and report total. Compare against targets:
- **Real-time threshold**: < 2 seconds total
- **Acceptable**: < 5 seconds total
- **Needs optimization**: > 5 seconds total

## Output

Save results to `docs/research/benchmarks/[target]-[YYYY-MM-DD].md` using the benchmark-report template.

Fill in all template fields:
- Test Environment table with actual system specs
- Results table with measured values
- Comparison against previous benchmarks if they exist in `docs/research/benchmarks/`
- Gate Connections (Fire for compute power, Foundation for infrastructure stability)
- Verdict: ADOPT / OPTIMIZE / ACCEPTABLE / INVESTIGATE

## Post-Benchmark

Print a summary with:
- Key metrics in a table
- Whether targets were met
- Top recommendation (optimize, upgrade, or proceed)
- Comparison to previous benchmark if one exists for the same target
