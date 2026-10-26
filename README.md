<div align="center">
  <h1>TILDE: Teacher-in-the-Loop Distillation from Embodied Foundation Models</h1>
  <p align="center">
    <strong><a href="https://innovator-zero.github.io/">Yuxiang Lu</a><sup>*</sup></strong>
    &nbsp;&nbsp;
    <strong><a href="https://www.linkedin.com/in/yantong-liu-10aa7734b/">Yantong Liu</a><sup>*</sup></strong>
    &nbsp;&nbsp;
    <strong><a href="https://scholar.google.com/citations?user=aoqtBAsAAAAJ&amp;hl=en">Jinghua Hou</a></strong>
    &nbsp;&nbsp;
    <strong><a href="https://www.linkedin.com/in/xueli-sun-69b9182b6/">Xueli Sun</a></strong>
    <br>
    <strong><a href="https://hanruihua.github.io/">Ruihua Han</a></strong>
    &nbsp;&nbsp;
    <strong><a href="https://happinesslz.github.io/">Zhe Liu</a></strong>
    &nbsp;&nbsp;
    <strong><a href="https://i.cs.hku.hk/~hszhao/">Hengshuang Zhao</a></strong>
  </p>

  <p align="center">
    The University of Hong Kong
    <br>
    <sup>*</sup> Equal contribution
  </p>

  <p align="center">
    <a href="https://arxiv.org/abs/2610.25376"><img alt="arXiv" src="https://img.shields.io/badge/arXiv-2610.25376-b31b1b.svg"></a>
    <a href="https://hku-sail.github.io/TILDE/"><img alt="Project Page" src="https://img.shields.io/badge/Project_Page-82B366.svg"></a>
  </p>
</div>

## TL;DR

Can we transfer the capabilities of pretrained embodied foundation models without repeating expensive action pretraining? **TILDE** addresses this challenge by distilling teacher knowledge across **demonstrations, student-induced rollouts, and teacher-executed recovery trajectories**, improving task performance by **up to 4.1× over behavior cloning**. At its core, AutoDAgger enables autonomous data collection by monitoring student execution and triggering teacher intervention, collecting recovery experience **2.2-2.6× faster than human-in-the-loop takeover**, without human monitoring or manual control.

[▶ Watch the demo video](https://hku-sail.github.io/TILDE/static/videos/Demo.mp4)

## 📰 News

- **Oct 20 2026**: Paper released.

## ✨ Abstract

Large-scale action pretraining equips Embodied Foundation Models (EFMs) with strong manipulation capabilities, with particular strengths in generalization and closed-loop robustness, but reproducing such pretraining requires substantial robot data and computation. To transfer these capabilities from pretrained EFMs to policies without action pretraining, we introduce TILDE (**T**eacher-**I**n-the-**L**oop **D**istillation from **E**FMs), which synergizes on-policy distillation at student-induced states with learning from teacher-executed recovery trajectories. We further propose AutoDAgger, an autonomous data aggregation pipeline in which a robotic reward model is utilized to monitor task progress and trigger teacher intervention, thereby collecting recovery experience without human monitoring or manual control. AutoDAgger accelerates recovery-trajectory collection by more than 2× compared with the human-in-the-loop method. By unifying learning from demonstrations, on-policy teacher supervision, and teacher's corrective behavior, TILDE improves task performance by up to 4.1× over behavior cloning across three real-world tasks and supports effective cross-architecture distillation.

## 📖 Citation

```bibtex
@article{lu2026tilde,
  title={TILDE: Teacher-in-the-Loop Distillation from Embodied Foundation Models},
  author={Yuxiang Lu and Yantong Liu and Jinghua Hou and Xueli Sun and Ruihua Han and Zhe Liu and Hengshuang Zhao},
  year={2026},
  journal={arXiv preprint arXiv:2610.25376},
}
```
