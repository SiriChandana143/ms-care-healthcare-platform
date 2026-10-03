import { useMemo } from 'react';
import { MSCareRobot } from './MSCareRobot';
import { ChargingDock } from './ChargingDock';
import { WasteUnit } from './WasteUnit';
import { RoboticCrane } from './RoboticCrane';
import { CoverSlider } from './CoverSlider';
import { MovableCenterSection } from './MovableCenterSection';
import type { CameraView } from '../../types';

export type BedPosition = 'flat' | 'adjusting' | 'chair' | 'returning';

export type NormalCarePhase =
  | 'idle'
  | 'safety-check'
  | 'robot-ready'
  | 'bed-adjusting'
  | 'chair-position'
  | 'care-prep'
  | 'central-open'
  | 'slider-enter'
  | 'care-active'
  | 'washing'
  | 'slider-retrieve'
  | 'central-close'
  | 'bed-returning'
  | 'care-completed'
  | 'robot-returning'
  | 'docked';

interface NormalBedSimulationProps {
  phase: NormalCarePhase;
  bedPosition: BedPosition;
  cameraView?: CameraView;
  className?: string;
}

// Action flags derived from phase
interface PhaseActions {
  scanning: boolean;
  centerOpen: boolean;
  centerClosing: boolean;
  sliderVisible: boolean;
  sliderHasCover: boolean;
  sliderSealed: boolean;
  sliderExiting: boolean;
  sliderLocked: boolean;
  washing: boolean;
  careActive: boolean;
  craneDeployed: boolean;
  craneHasWaste: boolean;
}

function getActions(phase: NormalCarePhase): PhaseActions {
  return {
    scanning: phase === 'robot-ready' || phase === 'safety-check',
    centerOpen: phase === 'central-open' || phase === 'slider-enter' || phase === 'care-active' || phase === 'washing' || phase === 'slider-retrieve',
    centerClosing: phase === 'central-close',
    sliderVisible: phase === 'slider-enter' || phase === 'care-active' || phase === 'washing' || phase === 'slider-retrieve',
    sliderHasCover: phase === 'care-active' || phase === 'washing' || phase === 'slider-retrieve',
    sliderSealed: phase === 'slider-retrieve',
    sliderExiting: false,
    sliderLocked: phase === 'care-active' || phase === 'washing',
    washing: phase === 'washing',
    careActive: phase === 'care-active',
    craneDeployed: phase === 'care-completed' || phase === 'robot-returning',
    craneHasWaste: phase === 'care-completed',
  };
}

export function NormalBedSimulation({ phase, bedPosition, cameraView = '3d', className = '' }: NormalBedSimulationProps) {
  const viewTransform = useMemo(() => {
    switch (cameraView) {
      case 'top': return { rotateX: 72, rotateY: 0, scale: 1.1 };
      case 'side': return { rotateX: 8, rotateY: 50, scale: 1 };
      case 'mechanism': return { rotateX: 30, rotateY: 20, scale: 1.15 };
      default: return { rotateX: 16, rotateY: -6, scale: 1 };
    }
  }, [cameraView]);

  // Head/back section angle: 0° = flat, 55° = chair
  const headAngle = bedPosition === 'chair' ? 55 : bedPosition === 'adjusting' ? 28 : bedPosition === 'returning' ? 24 : 0;
  // Foot section angle: 0° = flat, 15° = lowered (foot goes DOWN)
  const footAngle = bedPosition === 'chair' ? 15 : bedPosition === 'adjusting' ? 8 : bedPosition === 'returning' ? 7 : 0;

  const a = getActions(phase);
  const robotAtDock = phase === 'idle' || phase === 'docked' || phase === 'robot-returning';
  const phaseBadge =
    phase === 'safety-check' ? 'SAFETY CHECK' :
    phase === 'bed-adjusting' ? 'BACK SECTION RISING • FOOT SECTION LOWERING' :
    phase === 'care-prep' ? 'CARE PREPARATION' :
    phase === 'central-open' ? 'CENTRAL ACCESS OPENING' :
    phase === 'slider-enter' ? 'BED SLIDER ENTERING' :
    phase === 'care-active' ? 'CARE ACTIVE' :
    phase === 'washing' ? 'WASHING' :
    phase === 'slider-retrieve' ? 'RETRIEVING USED MODULE' :
    phase === 'central-close' ? 'CENTRAL ACCESS CLOSING' :
    phase === 'bed-returning' ? 'RETURNING TO FLAT' :
    phase === 'care-completed' ? 'CARE COMPLETED' :
    bedPosition === 'chair' ? 'CHAIR POSITION' :
    bedPosition === 'adjusting' ? 'ADJUSTING BED POSITION' :
    bedPosition === 'returning' ? 'RETURNING TO FLAT' :
    'FLAT POSITION';

  // Articulation joint positions as percentage of bed length (from top/head)
  const headJointPct = 38;  // head section is top 38%
  const footJointPct = 72;  // foot section starts at 72%

  // Small central access section dimensions (around pelvic area)
  // Located in the middle section, centered horizontally, small
  const centralTop = 55;   // % of bed height, around the pelvic area
  const centralHeight = 16; // % of bed height — intentionally small
  const centralLeft = 39;   // % of bed width — centered
  const centralWidth = 22;  // % of bed width — a small integrated module
  const middleHeightPct = footJointPct - headJointPct;
  const centralTopInMiddle = ((centralTop - headJointPct) / middleHeightPct) * 100;
  const centralHeightInMiddle = (centralHeight / middleHeightPct) * 100;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="perspective-container relative" style={{ aspectRatio: '16/10' }}>
        <div
          className="relative w-full h-full transition-all duration-1000"
          style={{
            transform: `rotateX(${viewTransform.rotateX}deg) rotateY(${viewTransform.rotateY}deg) scale(${viewTransform.scale})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Floor */}
          <div className="absolute inset-0 rounded-2xl" style={{
            transform: 'translateZ(-40px)',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            opacity: 0.5,
          }} />

          {/* === CONTINUOUS ADJUSTABLE HOSPITAL BED === */}
          <div className="absolute" style={{
            top: '14%', left: '14%', right: '14%', bottom: '24%', transformStyle: 'preserve-3d',
          }}>
            {/* Reference-style full bed frame and end panels */}
            <div className="absolute inset-x-[-3%] top-[-7%] h-[15%] rounded-t-2xl bg-gradient-to-b from-white to-gray-200 border border-gray-300 shadow-medium" style={{ transform: 'translateZ(-18px)' }}>
              <div className="absolute inset-x-[25%] bottom-2 h-1.5 rounded-full bg-medical-500/80" />
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tracking-wide text-navy-800">MS.care</div>
            </div>
            <div className="absolute inset-x-[-3%] bottom-[-7%] h-[15%] rounded-b-2xl bg-gradient-to-b from-gray-200 to-white border border-gray-300 shadow-medium" style={{ transform: 'translateZ(-18px)' }}>
              <div className="absolute inset-x-[28%] top-2 h-1.5 rounded-full bg-medical-400/80" />
            </div>
            <div className="absolute left-[-5%] top-[5%] bottom-[5%] w-[5%] rounded-full bg-white border border-gray-300 shadow-soft" style={{ transform: 'translateZ(-8px)' }} />
            <div className="absolute right-[-5%] top-[5%] bottom-[5%] w-[5%] rounded-full bg-white border border-gray-300 shadow-soft" style={{ transform: 'translateZ(-8px)' }} />

            {/* --- Underlying mechanical support --- */}

            {/* Head/back support — rotates UP at head joint */}
            <div
              className="absolute bed-transition"
              style={{
                top: '0%', height: `${headJointPct}%`, left: '0%', right: '0%',
                transformOrigin: 'bottom center',
                transform: `rotateX(-${headAngle}deg)`,
                transitionDuration: '2.5s',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="absolute inset-0 rounded-t-xl" style={{
                background: 'linear-gradient(180deg, #d1d5db 0%, #e5e7eb 100%)',
                transform: 'translateZ(-14px)',
                boxShadow: '0 2px 8px rgba(16,42,67,0.1)',
              }} />
              {/* Side rails */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l bg-gray-300" style={{ transform: 'translateZ(-8px)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-1.5 rounded-r bg-gray-300" style={{ transform: 'translateZ(-8px)' }} />
            </div>

            {/* Middle/seat support — fixed */}
            <div className="absolute" style={{
              top: `${headJointPct}%`, height: `${footJointPct - headJointPct}%`,
              left: '0%', right: '0%', transformStyle: 'preserve-3d',
            }}>
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)',
                transform: 'translateZ(-14px)',
              }} />
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-300" style={{ transform: 'translateZ(-8px)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gray-300" style={{ transform: 'translateZ(-8px)' }} />
            </div>

            {/* Foot support — rotates DOWN at foot joint */}
            <div
              className="absolute bed-transition"
              style={{
                top: `${footJointPct}%`, height: `${100 - footJointPct}%`,
                left: '0%', right: '0%',
                transformOrigin: 'top center',
                transform: `rotateX(${footAngle}deg)`,
                transitionDuration: '2.5s',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="absolute inset-0 rounded-b-xl" style={{
                background: 'linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)',
                transform: 'translateZ(-14px)',
              }} />
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l bg-gray-300" style={{ transform: 'translateZ(-8px)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-1.5 rounded-r bg-gray-300" style={{ transform: 'translateZ(-8px)' }} />
            </div>

            {/* --- CONTINUOUS MATTRESS (one surface, three segments that bend at joints) --- */}
            {/* Head section of mattress */}
            <div
              className="absolute bed-transition"
              style={{
                top: '0%', height: `${headJointPct}%`, left: '0%', right: '0%',
                transformOrigin: 'bottom center',
                transform: `rotateX(-${headAngle}deg)`,
                transitionDuration: '2.5s',
                transformStyle: 'preserve-3d',
              }}
            >
              <MattressSection rounded="top" />
            </div>

            {/* Middle section of mattress — contains the small central access section */}
            <div className="absolute" style={{
              top: `${headJointPct}%`, height: `${footJointPct - headJointPct}%`,
              left: '0%', right: '0%', transformStyle: 'preserve-3d',
            }}>
              {/* Main mattress surface (with hole where central section sits) */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(180deg, #bfdbfe 0%, #93c5fd 50%, #bfdbfe 100%)',
                }} />
                {/* Air cells across full width */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="absolute rounded-full" style={{
                    top: `${(i * 100) / 5}%`,
                    height: `${100 / 5 - 1.5}%`,
                    left: '3%', right: '3%',
                    background: `linear-gradient(180deg, ${i % 2 === 0 ? '#bfdbfe' : '#93c5fd'} 0%, ${i % 2 === 0 ? '#93c5fd' : '#bfdbfe'} 50%, ${i % 2 === 0 ? '#bfdbfe' : '#93c5fd'} 100%)`,
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(37,99,235,0.1)',
                  }} />
                ))}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 30%, transparent 70%, rgba(37,99,235,0.06) 100%)',
                }} />
              </div>

              {/* Small central access section — slides sideways */}
              <MovableCenterSection
                isOpen={a.centerOpen}
                className="rounded-lg z-10"
                style={{
                  top: `${centralTopInMiddle}%`,
                  height: `${centralHeightInMiddle}%`,
                  left: `${centralLeft}%`,
                  width: `${centralWidth}%`,
                }}
              />

              {/* Opening visible when central section slides away */}
              {a.centerOpen && (
                <div className="absolute rounded-lg" style={{
                  top: `${centralTopInMiddle}%`,
                  height: `${centralHeightInMiddle}%`,
                  left: `${centralLeft}%`,
                  width: `${centralWidth}%`,
                  background: 'linear-gradient(180deg, rgba(16,42,67,0.1) 0%, rgba(16,42,67,0.18) 100%)',
                  boxShadow: 'inset 0 2px 8px rgba(16,42,67,0.2)',
                }}>
                  <div className="absolute inset-1 rounded border-2 border-dashed border-medical-300/50" />
                </div>
              )}

              {/* Guide rails when open */}
              {a.centerOpen && (
                <>
                  <div className="absolute bg-medical-300/60 rounded-full" style={{
                    top: `${centralTopInMiddle - 3}%`, left: '20%', width: '60%', height: '1.5%',
                  }} />
                  <div className="absolute bg-medical-300/60 rounded-full" style={{
                    top: `${centralTopInMiddle + centralHeightInMiddle + 1}%`, left: '20%', width: '60%', height: '1.5%',
                  }} />
                </>
              )}

              {/* Cover slider entering through the opening */}
              {a.sliderVisible && (
                <CoverSlider
                  visible={a.sliderVisible}
                  hasCover={a.sliderHasCover}
                  sealed={a.sliderSealed}
                  locked={a.sliderLocked}
                  washing={a.washing}
                  className="rounded-lg z-20"
                  style={{
                    top: `${centralTopInMiddle - 3}%`,
                    height: `${centralHeightInMiddle + 6}%`,
                    left: `${centralLeft - 5}%`,
                    width: `${centralWidth + 10}%`,
                  }}
                />
              )}

              {/* Care mode indicator */}
              {a.careActive && (
                <div className="absolute rounded-lg pointer-events-none z-20" style={{
                  top: `${centralTopInMiddle - 3}%`,
                  height: `${centralHeightInMiddle + 6}%`,
                  left: `${centralLeft - 5}%`,
                  width: `${centralWidth + 10}%`,
                }}>
                  <div className="absolute inset-0 rounded-lg border-2 border-medical-400/50 animate-pulse-soft" />
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-medical-500 text-white text-[7px] font-bold tracking-wider">
                    CARE ACTIVE
                  </div>
                </div>
              )}

              {/* Central section label */}
              {a.centerOpen && (
                <div className="absolute pointer-events-none" style={{
                  bottom: '-8%', left: '50%', transform: 'translateX(-50%) translateZ(20px)',
                }}>
                  <div className="px-2 py-0.5 rounded-full bg-navy-800 text-white text-[6px] font-bold tracking-wider whitespace-nowrap">
                    CENTRAL ACCESS SECTION
                  </div>
                </div>
              )}
              {a.centerClosing && (
                <div className="absolute pointer-events-none" style={{
                  bottom: '-8%', left: '50%', transform: 'translateX(-50%) translateZ(20px)',
                }}>
                  <div className="px-2 py-0.5 rounded-full bg-safe-500 text-white text-[6px] font-bold tracking-wider whitespace-nowrap">
                    CENTRAL SECTION LOCKED
                  </div>
                </div>
              )}
            </div>

            {/* Foot section of mattress */}
            <div
              className="absolute bed-transition"
              style={{
                top: `${footJointPct}%`, height: `${100 - footJointPct}%`,
                left: '0%', right: '0%',
                transformOrigin: 'top center',
                transform: `rotateX(${footAngle}deg)`,
                transitionDuration: '2.5s',
                transformStyle: 'preserve-3d',
              }}
            >
              <MattressSection rounded="bottom" />
            </div>

            {/* Integrated side safety supports */}
            <div className="absolute left-0 top-[8%] bottom-[8%] w-2 rounded-full bg-white/80 border border-gray-300 shadow-soft" style={{ transform: 'translateZ(13px)' }} />
            <div className="absolute right-0 top-[8%] bottom-[8%] w-2 rounded-full bg-white/80 border border-gray-300 shadow-soft" style={{ transform: 'translateZ(13px)' }} />

            {/* Articulation joint creases */}
            <div className="absolute bed-transition" style={{
              top: `${headJointPct - 1}%`, height: '2px', left: '3%', right: '3%',
              background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.15), transparent)',
              transform: `translateZ(2px) rotateX(-${headAngle * 0.3}deg)`,
              transformOrigin: 'bottom center',
              transitionDuration: '2.5s',
              borderRadius: '9999px',
            }} />
            <div className="absolute bed-transition" style={{
              top: `${footJointPct - 1}%`, height: '2px', left: '3%', right: '3%',
              background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.15), transparent)',
              transform: `translateZ(2px) rotateX(${footAngle * 0.3}deg)`,
              transformOrigin: 'top center',
              transitionDuration: '2.5s',
              borderRadius: '9999px',
            }} />

            {/* --- PATIENT (on continuous mattress, follows bed shape) --- */}
            <div
              className="absolute inset-0 z-30 bed-transition"
              style={{
                transform: `translateZ(25px)`,
                transformOrigin: `${headJointPct}% center`,
                transitionDuration: '2.5s',
                pointerEvents: 'none',
              }}
            >
              {/* Patient head */}
              <div
                className="absolute rounded-full bg-gray-200/80 bed-transition"
                style={{
                  width: '11%', height: '18%', left: '14%', top: '10%',
                  boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.08)',
                  transform: `rotateX(-${headAngle}deg)`,
                  transformOrigin: 'bottom center',
                  transitionDuration: '2.5s',
                }}
              />
              {/* Patient body under blanket — from upper back through hips */}
              <div
                className="absolute rounded-2xl bed-transition"
                style={{
                  width: '72%', height: '48%', left: '14%', top: '22%',
                  background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
                  boxShadow: '0 2px 8px rgba(16,42,67,0.08), inset 0 1px 3px rgba(255,255,255,0.6)',
                  transformOrigin: `${headJointPct}% center`,
                  transform: `perspective(400px) rotateX(-${headAngle * 0.5}deg)`,
                  transitionDuration: '2.5s',
                }}
              >
                <div className="absolute inset-x-0 top-0 h-1/3 rounded-t-2xl" style={{
                  background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                }} />
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-20">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="absolute w-full" style={{
                      top: `${15 + i * 16}%`, height: '1px', background: '#94a3b8',
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Section labels */}
            <div className="absolute pointer-events-none z-40" style={{ top: '-12%', left: '2%', transform: 'translateZ(45px)' }}>
              <div className="px-2 py-1 rounded-lg bg-medical-600 text-white text-[7px] font-bold leading-tight shadow-soft whitespace-nowrap">
                Upper Part —<br />Elevates
              </div>
            </div>
            <div className="absolute pointer-events-none z-40" style={{ top: '48%', left: '50%', transform: 'translate(-50%, -50%) translateZ(45px)' }}>
              <div className="px-2 py-1 rounded-lg bg-navy-800 text-white text-[7px] font-bold leading-tight shadow-soft whitespace-nowrap text-center">
                Movable Section —<br />Central Access
              </div>
            </div>
            <div className="absolute pointer-events-none z-40" style={{ bottom: '-14%', right: '2%', transform: 'translateZ(45px)' }}>
              <div className="px-2 py-1 rounded-lg bg-medical-600 text-white text-[7px] font-bold leading-tight shadow-soft whitespace-nowrap text-right">
                Lower Part —<br />Declines
              </div>
            </div>

            {/* Bed legs */}
            <div className="absolute bottom-0 left-[6%] w-2.5 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b" style={{ transform: 'translateZ(-30px)' }} />
            <div className="absolute bottom-0 right-[6%] w-2.5 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b" style={{ transform: 'translateZ(-30px)' }} />
          </div>

          {/* === MS.CARE ROBOT === */}
          <div
            className="absolute bed-transition"
            style={{
              bottom: '4%', right: robotAtDock ? '20%' : '4%', width: '16%',
              transformStyle: 'preserve-3d', transitionDuration: '2s',
            }}
          >
            <div style={{ transform: 'translateZ(15px)' }}>
              <MSCareRobot scanning={a.scanning} docked={phase === 'idle' || phase === 'docked'} />
            </div>
            {a.craneDeployed && (
              <div className="absolute" style={{
                top: '5%', left: '15%', width: '70%', height: '55%', transformStyle: 'preserve-3d',
              }}>
                <RoboticCrane deployed={a.craneDeployed} hasWaste={a.craneHasWaste} />
              </div>
            )}
          </div>

          {/* === CHARGING DOCK === */}
          <div className="absolute" style={{
            bottom: '4%', right: '2%', width: '14%', transformStyle: 'preserve-3d',
          }}>
            <div style={{ transform: 'translateZ(10px)' }}>
              <ChargingDock active={phase === 'docked' || phase === 'robot-returning'} />
            </div>
          </div>

          {/* === VERTICAL WASTE UNIT === */}
          <div className="absolute" style={{
            bottom: '6%', left: '3%', width: '8%', transformStyle: 'preserve-3d',
          }}>
            <div style={{ transform: 'translateZ(15px)' }}>
              <WasteUnit fillLevel={32} active={phase === 'care-completed'} />
            </div>
          </div>

          {/* Scanning beam */}
          {a.scanning && (
            <div className="absolute pointer-events-none" style={{
              top: '18%', right: '18%', width: '35%', height: '40%',
            }}>
              <div className="w-full h-full" style={{
                background: 'radial-gradient(ellipse at right center, rgba(59,130,246,0.15) 0%, transparent 60%)',
              }} />
            </div>
          )}

          {/* Direction indicators */}
          {bedPosition === 'adjusting' || bedPosition === 'chair' || bedPosition === 'returning' ? (
            <>
              <div className="absolute pointer-events-none" style={{ top: '22%', left: '19%', transform: 'translateZ(55px)' }}>
                <div className="text-medical-600 text-lg font-bold">↑</div>
              </div>
              <div className="absolute pointer-events-none" style={{ bottom: '24%', right: '17%', transform: 'translateZ(55px)' }}>
                <div className="text-medical-600 text-lg font-bold">↓</div>
              </div>
            </>
          ) : null}

          {/* Bed position status badge */}
          <div className="absolute pointer-events-none" style={{
            top: '5%', left: '50%', transform: 'translateX(-50%) translateZ(40px)',
          }}>
            <div className={`px-3 py-1 rounded-full text-[8px] font-bold tracking-wider whitespace-nowrap ${
              bedPosition === 'chair' ? 'bg-sky-500 text-white' :
              bedPosition === 'adjusting' ? 'bg-warn-500 text-white animate-pulse-soft' :
              bedPosition === 'returning' ? 'bg-warn-500 text-white' :
              'bg-navy-800 text-white'
            }`}>
              {phaseBadge}
            </div>
          </div>

          {/* Care mode badge */}
          {a.careActive && (
            <div className="absolute pointer-events-none" style={{
              top: '14%', left: '50%', transform: 'translateX(-50%) translateZ(40px)',
            }}>
              <div className="px-3 py-1 rounded-full bg-medical-500 text-white text-[8px] font-bold tracking-wider">
                NORMAL CARING MODE ACTIVE
              </div>
            </div>
          )}

          {/* Care completed badge */}
          {phase === 'care-completed' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{
              transform: 'translateZ(50px)',
            }}>
              <div className="w-14 h-14 rounded-full bg-safe-500 flex items-center justify-center shadow-large animate-scale-in">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          {/* Docked label */}
          {phase === 'docked' && (
            <div className="absolute pointer-events-none" style={{ bottom: '20%', right: '8%' }}>
              <div className="px-2 py-0.5 rounded-full bg-safe-500 text-white text-[7px] font-bold tracking-wider">
                DOCKED
              </div>
            </div>
          )}
        </div>

        {/* Camera view label */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-navy-700 text-xs font-semibold shadow-soft">
          {cameraView === '3d' && '3D View'}
          {cameraView === 'top' && 'Top View'}
          {cameraView === 'side' && 'Side View'}
          {cameraView === 'mechanism' && 'Mechanism View'}
        </div>
      </div>
    </div>
  );
}

// Reusable mattress section component
function MattressSection({ rounded }: { rounded: 'top' | 'bottom' | 'none' }) {
  const radius = rounded === 'top' ? 'rounded-t-xl' : rounded === 'bottom' ? 'rounded-b-xl' : '';
  return (
    <div className={`absolute inset-0 ${radius} overflow-hidden`}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          top: `${(i * 100) / 7}%`,
          height: `${100 / 7 - 1.5}%`,
          left: '3%', right: '3%',
          background: `linear-gradient(180deg, ${i % 2 === 0 ? '#dbeafe' : '#bfdbfe'} 0%, ${i % 2 === 0 ? '#bfdbfe' : '#93c5fd'} 50%, ${i % 2 === 0 ? '#dbeafe' : '#bfdbfe'} 100%)`,
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(37,99,235,0.1)',
        }} />
      ))}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 30%, transparent 70%, rgba(37,99,235,0.06) 100%)',
      }} />
    </div>
  );
}
