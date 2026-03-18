'use client';
import React from 'react';
import styled from 'styled-components';
import { Calculator, FlaskConical, BookOpen } from 'lucide-react';

type SelectorProps = {
    activeSubject: string;
    onSelect: (id: string) => void;
};

const subjects = [
    { id: 'math', name: 'Math', tagline: 'Logical thinking & problem solving', Icon: Calculator, color: '#2563eb' },
    { id: 'science', name: 'Science', tagline: 'Concept clarity & scientific reasoning', Icon: FlaskConical, color: '#059669' },
    { id: 'english', name: 'English', tagline: 'Fluency & confidence', Icon: BookOpen, color: '#dc2626' },
];

export default function SubjectSelector({ activeSubject, onSelect }: SelectorProps) {
    return (
        <StyledWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {subjects.map((subject) => {
                    const Icon = subject.Icon;
                    const isActive = activeSubject === subject.id;
                    return (
                        <button
                            key={subject.id}
                            onClick={() => onSelect(subject.id)}
                            className="relative group focus:outline-none"
                        >
                            <Card $isActive={isActive} $color={subject.color}>
                                <div className="icon-wrapper" style={{ backgroundColor: `${subject.color}15`, color: subject.color }}>
                                    <Icon size={24} />
                                </div>
                                <h3 className="heading">{subject.name}</h3>
                                <p className="tagline">{subject.tagline}</p>
                            </Card>
                        </button>
                    );
                })}
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
  }
  
  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

const Card = styled.div<{ $isActive: boolean; $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding: 32px 24px;
  background: var(--color-surface);
  border-radius: 16px;
  border: 2px solid ${props => props.$isActive ? props.$color : 'var(--color-border)'};
  box-shadow: ${props => props.$isActive ? `0 8px 30px ${props.$color}25` : '0 4px 6px rgba(0,0,0,0.05)'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.$color};
    transform: translateY(-2px);
    box-shadow: 0 8px 30px ${props => props.$color}15;
  }

  .icon-wrapper {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .heading {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 4px;
  }

  .tagline {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.4;
  }
`;
