'use client';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

interface Subject {
    id: string;
    title: string;
    description: string;
    icon: string;
    subTopics: string[];
    gradient: string;
}

interface SubjectCardProps {
    subject: Subject;
    index: number;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
    return (
        <Link href={`/search?subject=${subject.id}`} className="block h-full">
            <StyledWrapper>
                <div className="card">
                    <div className="content">
                        <div className="icon-wrapper">
                            <span className="text-3xl">{subject.icon}</span>
                        </div>
                        <h3 className="heading">{subject.title}</h3>
                        <p className="para">{subject.description}</p>
                        
                        <div className="topics-wrapper">
                            <p className="topics-label">Popular Topics</p>
                            <div className="topics">
                                {subject.subTopics.slice(0, 3).map((topic: string, i: number) => (
                                    <span key={i} className="topic-tag">{topic}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </StyledWrapper>
        </Link>
    );
}

const StyledWrapper = styled.div`
  height: 100%;

  .card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 480px;
    padding: 2px;
    border-radius: 24px;
    overflow: hidden;
    line-height: 1.6;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    background: #ffffff;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 34px;
    border-radius: 22px;
    width: 100%;
    height: 100%;
    min-height: 476px;
    background: #ffffff;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  .heading {
    font-weight: 700;
    font-size: 24px;
    line-height: 1.3;
    color: #1a1a2e;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .para {
    z-index: 1;
    opacity: 0.8;
    font-size: 15px;
    color: #4a4a6a;
    line-height: 1.6;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .topics-wrapper {
    margin-top: auto;
  }

  .topics-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
    margin-bottom: 10px;
  }

  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .topic-tag {
    font-size: 12px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 8px;
    background: #f0f0f5;
    color: #4a4a6a;
    border: 1px solid #e0e0e8;
  }

  .card::before {
    content: "";
    position: absolute;
    height: 160%;
    width: 160%;
    border-radius: inherit;
    background: linear-gradient(to right, #667eea, #764ba2);
    transform-origin: center;
    animation: moving 4.8s linear infinite paused;
    transition: all 0.88s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 0;
  }

  .card:hover::before {
    animation-play-state: running;
    z-index: -1;
    width: 20%;
  }

  .card:hover .content .heading,
  .card:hover .content .para {
    color: #000000;
  }

  .card:hover .content {
    background: #ffffff;
  }

  .card:hover {
    box-shadow: 0rem 6px 13px rgba(102, 126, 234, 0.15),
      0rem 24px 24px rgba(102, 126, 234, 0.12),
      0rem 55px 33px rgba(102, 126, 234, 0.08),
      0rem 97px 39px rgba(102, 126, 234, 0.03);
    scale: 1.02;
  }

  @keyframes moving {
    0% { transform: rotate(0); }
    100% { transform: rotate(360deg); }
  }

  @media (prefers-color-scheme: dark) {
    .card {
      background: #1a1a2e;
    }

    .content {
      background: #1a1a2e;
    }

    .heading {
      color: #ffffff;
    }

    .para {
      color: #a0a0b8;
    }

    .topic-tag {
      background: rgba(255, 255, 255, 0.1);
      color: #d0d0e0;
      border-color: rgba(255, 255, 255, 0.15);
    }

    .topics-label {
      color: #888;
    }

    .card::before {
      background: linear-gradient(to right, #4c1d95, #7c3aed);
    }

    .card:hover::before {
      background: linear-gradient(to right, #4c1d95, #7c3aed);
    }

    .card:hover .heading,
    .card:hover .para {
      color: #ffffff;
    }

    .card:hover {
      box-shadow: 0rem 6px 13px rgba(124, 58, 237, 0.2),
        0rem 24px 24px rgba(124, 58, 237, 0.15),
        0rem 55px 33px rgba(124, 58, 237, 0.1);
    }
  }
`;
