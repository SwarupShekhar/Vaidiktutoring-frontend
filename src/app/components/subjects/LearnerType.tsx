import React from 'react';
import styled from 'styled-components';
import { Compass, Medal, Rocket } from 'lucide-react';

const cards = [
    {
        title: 'Remediation Path',
        label: 'Needs Support?',
        description: 'We build confidence by revisiting foundational gaps and using scaffolded learning techniques to bring students up to speed efficiently.',
        features: ['Confidence Building', 'Gap Analysis'],
        Icon: Compass,
        color: '#f97316',
    },
    {
        title: 'Mastery Path',
        label: 'On Track?',
        description: 'We reinforce school learning with rigorous practice and conceptual deepening, ensuring students excel in exams and assessments.',
        features: ['Exam Excellence', 'Conceptual Depth'],
        Icon: Medal,
        color: '#0ea5e9',
    },
    {
        title: 'Challenge Path',
        label: 'Advanced Learner?',
        description: 'We challenge high achievers with university-level concepts, critical thinking projects, and competitive exam preparation.',
        features: ['University Prep', 'Critical Thinking'],
        Icon: Rocket,
        color: '#8b5cf6',
    },
];

export default function LearnerType() {
    return (
        <section className="mb-32">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-deep-navy dark:text-white mb-4">Tailored for Every Learner</h2>
                <p className="text-lg text-text-secondary">We meet students exactly where they are.</p>
            </div>
            <StyledWrapper>
                <div className="grid">
                    {cards.map((card, index) => {
                        const Icon = card.Icon;
                        return (
                            <div key={index} className={`card ${card.title.toLowerCase().replace(' ', '-')}`}>
                                <div className="content">
                                    <div className="icon-wrapper" style={{ color: card.color }}>
                                        <Icon size={28} />
                                    </div>
                                    <p className="heading">{card.title}</p>
                                    <p className="label" style={{ color: card.color }}>{card.label}</p>
                                    <p className="para">{card.description}</p>
                                    <ul className="tags">
                                        {card.features.map((feature, i) => (
                                            <li key={i} style={{ backgroundColor: `${card.color}15`, color: card.color }}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </StyledWrapper>
        </section>
    );
}

const StyledWrapper = styled.div`
  .grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 3px;
    border-radius: 24px;
    overflow: hidden;
    line-height: 1.6;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card.remediation-path::before {
    background: linear-gradient(135deg, #f97316, #f97316);
  }

  .card.mastery-path::before {
    background: linear-gradient(135deg, #0ea5e9, #0ea5e9);
  }

  .card.challenge-path::before {
    background: linear-gradient(135deg, #8b5cf6, #8b5cf6);
  }

  .card::before {
    content: "";
    position: absolute;
    height: 160%;
    width: 160%;
    border-radius: inherit;
    transform-origin: center;
    animation: moving 4.8s linear infinite paused;
    transition: all 0.88s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 0;
  }

  .card:hover::before {
    animation-play-state: running;
    width: 20%;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 32px;
    border-radius: 22px;
    color: #ffffff;
    overflow: hidden;
    background: #ffffff;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .card:hover .content {
    background: #ffffff;
  }

  .icon-wrapper {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.05);
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card:hover .icon-wrapper {
    background: currentColor;
    color: #ffffff !important;
    transform: scale(1.1);
  }

  .heading {
    font-weight: 700;
    font-size: 24px;
    line-height: 1.3;
    z-index: 1;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    color: #1e293b;
    margin-bottom: -8px;
  }

  .label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    z-index: 1;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .para {
    z-index: 1;
    font-size: 14px;
    line-height: 1.7;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    color: #64748b;
  }

  .card:hover .heading,
  .card:hover .para {
    color: #000000;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
    z-index: 1;
    list-style: none;
    padding: 0;
  }

  .tags li {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card:hover .tags li {
    background: #0a3cff !important;
    color: #ffffff !important;
  }

  .card.remediation-path:hover {
    box-shadow: 0rem 6px 13px rgba(249, 115, 22, 0.15),
      0rem 24px 24px rgba(249, 115, 22, 0.1),
      0rem 55px 33px rgba(249, 115, 22, 0.05);
    scale: 1.02;
  }

  .card.mastery-path:hover {
    box-shadow: 0rem 6px 13px rgba(14, 165, 233, 0.15),
      0rem 24px 24px rgba(14, 165, 233, 0.1),
      0rem 55px 33px rgba(14, 165, 233, 0.05);
    scale: 1.02;
  }

  .card.challenge-path:hover {
    box-shadow: 0rem 6px 13px rgba(139, 92, 246, 0.15),
      0rem 24px 24px rgba(139, 92, 246, 0.1),
      0rem 55px 33px rgba(139, 92, 246, 0.05);
    scale: 1.02;
  }

  @keyframes moving {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (prefers-color-scheme: dark) {
    .content {
      background: #1e293b;
    }

    .heading {
      color: #f1f5f9;
    }

    .para {
      color: #94a3b8;
    }

    .card:hover .content {
      background: #1e293b;
    }

    .card:hover .heading,
    .card:hover .para {
      color: #ffffff;
    }
  }
`;
