import { useMemo } from 'react';
import { AirCellMattress } from './AirCellMattress';
import { PatientModel } from './PatientModel';
import { MovableCenterSection } from './MovableCenterSection';
import { CoverSlider } from './CoverSlider';
import { MSCareRobot } from './MSCareRobot';
import { RoboticCrane } from './RoboticCrane';
import { WasteUnit } from './WasteUnit';
import { ChargingDock } from './ChargingDock';
import { WashNozzle } from './WashNozzle';
import type { CameraView } from '../../types';

interface BedSimulationProps {
  step: number;
  cameraView?: CameraView;
  className?: string;
}

export function BedSimulation({ step, cameraView = '3d', className = '' }: BedSimulationProps) {
  const action = useMemo(() => {
    const a = ALL_ACTIONS[step] ?? ALL_ACTIONS[0];
    return a;
  }, [step]);

  const wasteFill = step >= 13 ? 35 : 32;

  const viewTransform = useMemo(() => {
    switch (cameraView) {
      case 'top':
        return { rotateX: 72, rotateY: 0, scale: 1.1 };
      case 'side':
        return { rotateX: 8, rotateY: 50, scale: 1 };
      case 'mechanism':
        return { rotateX: 30, rotateY: 20, scale: 1.15 };
      default:
        return { rotateX: 16, rotateY: -6, scale: 1 };
    }
  }, [cameraView]);

  const robotAtDock = action.idle || action.returnToDock || action.charging || action.fullyCharged;

  const sliderVisible = action.sliderEnter || action.sliderLocked || action.coverPlaced || action.careMode || action.washing || action.sliderRetrieve || action.sealing;
  const sliderHasCover = action.sliderLocked || action.coverPlaced || action.careMode || action.washing || action.sliderRetrieve || action.sealing;
  const sliderLocked = action.sliderLocked || action.coverPlaced || action.careMode || action.washing || action.sliderRetrieve;

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

          {/* === HOSPITAL BED === */}
          <div className="absolute" style={{
            top: '12%', left: '10%', right: '10%', bottom: '22%', transformStyle: 'preserve-3d',
          }}>
            {/* Bed frame */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-300 shadow-medium" style={{
              transform: 'translateZ(-20px)',
            }} />
            {/* Mattress base */}
            <div className="absolute inset-1 rounded-xl bg-white shadow-soft" style={{ transform: 'translateZ(-10px)' }} />

            {/* === FIXED LEFT SECTION === */}
            <div className="absolute rounded-lg overflow-hidden" style={{
              top: '5%', bottom: '5%', left: '3%', width: '38%',
              boxShadow: 'inset 0 1px 3px rgba(37,99,235,0.1)',
            }}>
              <AirCellMattress />
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[6px] font-bold text-navy-600 bg-white/70">FIXED</div>
            </div>

            {/* === MOVABLE CENTER SECTION === */}
            <MovableCenterSection
              isOpen={action.centerOpen}
              className="rounded-lg z-10"
              style={{
                top: '20%', bottom: '20%', left: '43%', width: '14%',
              }}
            />

            {/* Opening */}
            {action.centerOpen && (
              <div className="absolute rounded-lg" style={{
                top: '20%', bottom: '20%', left: '43%', width: '14%',
                background: 'linear-gradient(180deg, rgba(16,42,67,0.08) 0%, rgba(16,42,67,0.15) 100%)',
                boxShadow: 'inset 0 2px 8px rgba(16,42,67,0.18)',
              }}>
                <div className="absolute inset-1 rounded border-2 border-dashed border-medical-300/50" />
              </div>
            )}

            {/* Guide rails */}
            {action.centerOpen && (
              <>
                <div className="absolute bg-medical-300/60 rounded-full" style={{
                  top: '18%', left: '20%', width: '60%', height: '1.5%',
                }} />
                <div className="absolute bg-medical-300/60 rounded-full" style={{
                  bottom: '18%', left: '20%', width: '60%', height: '1.5%',
                }} />
              </>
            )}

            {/* === FIXED RIGHT SECTION === */}
            <div className="absolute rounded-lg overflow-hidden" style={{
              top: '5%', bottom: '5%', right: '3%', width: '38%',
              boxShadow: 'inset 0 1px 3px rgba(37,99,235,0.1)',
            }}>
              <AirCellMattress />
              <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[6px] font-bold text-navy-600 bg-white/70">FIXED</div>
            </div>

            {/* === COVER SLIDER === */}
            <CoverSlider
              visible={sliderVisible}
              hasCover={sliderHasCover}
              sealed={action.sealing || action.sliderExit}
              exiting={action.sliderExit}
              locked={sliderLocked}
              washing={action.washing}
              className="rounded-lg z-20"
              style={{
                top: '18%', bottom: '18%', left: '38%', width: '24%',
              }}
            />

            {/* Care mode indicator */}
            {action.careMode && (
              <div className="absolute rounded-lg pointer-events-none" style={{
                top: '18%', bottom: '18%', left: '38%', width: '24%',
              }}>
                <div className="absolute inset-0 rounded-lg border-2 border-medical-400/50 animate-pulse-soft" />
                <div className="absolute top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-medical-500 text-white text-[7px] font-bold tracking-wider">
                  CARE MODE
                </div>
              </div>
            )}

            {/* Washing stage overlay (water supply line from dock to slider) */}
            {action.washing && (
              <div className="absolute pointer-events-none" style={{
                top: '25%', right: '-8%', width: '12%', height: '15%',
              }}>
                {/* Animated supply line from dock to slider */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 rounded-full overflow-hidden" style={{
                  background: 'linear-gradient(90deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.35) 100%)',
                }}>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 w-2 h-full rounded-full"
                      style={{
                        background: 'rgba(59,130,246,0.6)',
                        animation: `wash-supply 2s linear ${i * 0.6}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Washing status labels */}
            {action.washing && (
              <div className="absolute pointer-events-none" style={{
                top: '10%', left: '50%', transform: 'translateX(-50%) translateZ(40px)',
              }}>
                <div className="flex items-center gap-1.5">
                  <div className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[6px] font-bold tracking-wider">
                    WASHING
                  </div>
                  <div className="px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[5px] font-semibold text-blue-600">
                    Clean water supplied
                  </div>
                  <div className="px-1.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[5px] font-semibold text-slate-500">
                    Used water sealed
                  </div>
                </div>
              </div>
            )}

            {/* Sealing animation */}
            {action.sealing && (
              <div className="absolute rounded-lg pointer-events-none" style={{
                top: '18%', bottom: '18%', left: '38%', width: '24%',
              }}>
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="absolute inset-x-0 h-0.5 bg-safe-400 animate-scan" style={{
                      animationDelay: `${i * 0.6}s`, top: '50%',
                    }} />
                  ))}
                </div>
                <div className="absolute top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-safe-500 text-white text-[7px] font-bold tracking-wider">
                  SEALING
                </div>
              </div>
            )}

            {/* Slider locked indicator */}
            {action.sliderLocked && !action.washing && (
              <div className="absolute pointer-events-none" style={{
                bottom: '14%', left: '50%', transform: 'translateX(-50%)',
              }}>
                <div className="px-2 py-0.5 rounded-full bg-navy-800 text-white text-[6px] font-bold tracking-wider">
                  SLIDER: LOCKED
                </div>
              </div>
            )}

            {/* === PATIENT === */}
            <div className="absolute inset-0 z-30" style={{ transform: 'translateZ(30px)' }}>
              <PatientModel />
            </div>

            {/* Bed legs */}
            <div className="absolute bottom-0 left-[8%] w-2 h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b" style={{ transform: 'translateZ(-25px)' }} />
            <div className="absolute bottom-0 right-[8%] w-2 h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b" style={{ transform: 'translateZ(-25px)' }} />
          </div>

          {/* === MS.CARE ROBOT === */}
          <div
            className="absolute bed-transition"
            style={{
              bottom: '4%',
              right: robotAtDock ? '20%' : '4%',
              width: '16%',
              transformStyle: 'preserve-3d',
              transitionDuration: '2s',
            }}
          >
            <div style={{ transform: 'translateZ(15px)' }}>
              <MSCareRobot
                scanning={action.scanning}
                docked={action.idle || action.charging || action.fullyCharged}
              />
            </div>

            {/* Robotic crane */}
            <div className="absolute" style={{
              top: '5%', left: '15%', width: '70%', height: '55%', transformStyle: 'preserve-3d',
            }}>
              <RoboticCrane
                deployed={action.craneDeploy || action.craneTransfer || action.wasteStored}
                hasWaste={action.craneTransfer || action.wasteStored}
              />
            </div>
          </div>

          {/* === CHARGING DOCK === */}
          <div className="absolute" style={{
            bottom: '4%', right: '2%', width: '14%', transformStyle: 'preserve-3d',
          }}>
            <div style={{ transform: 'translateZ(10px)' }}>
              <ChargingDock active={action.charging || action.fullyCharged || action.washing} />
            </div>
          </div>

          {/* === VERTICAL WASTE UNIT === */}
          <div className="absolute" style={{
            bottom: '6%', left: '3%', width: '8%', transformStyle: 'preserve-3d',
          }}>
            <div style={{ transform: 'translateZ(15px)' }}>
              <WasteUnit fillLevel={wasteFill} active={action.craneTransfer || action.wasteStored} />
            </div>
          </div>

          {/* Scanning beam */}
          {action.scanning && (
            <div className="absolute pointer-events-none" style={{
              top: '18%', right: '18%', width: '35%', height: '40%',
            }}>
              <div className="w-full h-full" style={{
                background: 'radial-gradient(ellipse at right center, rgba(59,130,246,0.15) 0%, transparent 60%)',
              }} />
            </div>
          )}

          {/* Movement arrows */}
          {action.centerOpen && action.justOpened && (
            <div className="absolute pointer-events-none" style={{
              top: '38%', left: '48%', transform: 'translateZ(40px)',
            }}>
              <div className="flex items-center gap-1 text-medical-500 text-xs font-bold animate-pulse-soft">
                → →
              </div>
            </div>
          )}

          {/* Central section label */}
          {action.centerOpen && action.justOpened && (
            <div className="absolute pointer-events-none" style={{
              top: '8%', left: '50%', transform: 'translateX(-50%) translateZ(40px)',
            }}>
              <div className="px-2 py-0.5 rounded-full bg-navy-900 text-white text-[6px] font-bold tracking-wider whitespace-nowrap">
                ONLY CENTRAL ACCESS SECTION MOVES
              </div>
            </div>
          )}

          {/* Completion checkmark */}
          {action.fullyCharged && (
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

          {/* Charging label */}
          {action.charging && (
            <div className="absolute pointer-events-none" style={{
              bottom: '20%', right: '8%',
            }}>
              <div className="px-2 py-0.5 rounded-full bg-safe-500 text-white text-[7px] font-bold tracking-wider">
                CHARGING
              </div>
            </div>
          )}

          {/* Docked label */}
          {action.fullyCharged && (
            <div className="absolute pointer-events-none" style={{
              bottom: '20%', right: '6%',
            }}>
              <div className="px-2 py-0.5 rounded-full bg-safe-600 text-white text-[7px] font-bold tracking-wider">
                FULLY CHARGED
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

// Action map for all 18 steps (0-indexed): 15 care steps + 3 post-cycle
const ALL_ACTIONS: Record<number, {
  idle: boolean; scanning: boolean; centerOpen: boolean; justOpened: boolean;
  sliderEnter: boolean; sliderLocked: boolean; coverPlaced: boolean; careMode: boolean;
  washing: boolean; sliderRetrieve: boolean; sealing: boolean; sliderExit: boolean;
  centerClose: boolean; craneDeploy: boolean; craneTransfer: boolean; wasteStored: boolean;
  craneRetract: boolean; returnToDock: boolean; charging: boolean; fullyCharged: boolean;
}> = {
  // 0: Normal bed position
  0: { idle: true, scanning: false, centerOpen: false, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 1: Camera alignment
  1: { idle: false, scanning: true, centerOpen: false, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 2: Central section opens
  2: { idle: false, scanning: false, centerOpen: true, justOpened: true, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 3: Slider enters with fresh cover
  3: { idle: false, scanning: false, centerOpen: true, justOpened: false, sliderEnter: true, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 4: Slider locks, cover placed
  4: { idle: false, scanning: false, centerOpen: true, justOpened: false, sliderEnter: false, sliderLocked: true, coverPlaced: true, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 5: Care mode
  5: { idle: false, scanning: false, centerOpen: true, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: true, careMode: true, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 6: WASHING — nozzle extends, water flows, waste water sealed
  6: { idle: false, scanning: false, centerOpen: true, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: true, careMode: false, washing: true, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 7: Used cover retrieval
  7: { idle: false, scanning: false, centerOpen: true, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: true, careMode: false, washing: false, sliderRetrieve: true, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 8: Sealing
  8: { idle: false, scanning: false, centerOpen: true, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: true, careMode: false, washing: false, sliderRetrieve: false, sealing: true, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 9: Slider exits
  9: { idle: false, scanning: false, centerOpen: true, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: true, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: true, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 10: Central section returns & locks
  10: { idle: false, scanning: false, centerOpen: false, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: true, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 11: Crane deploys
  11: { idle: false, scanning: false, centerOpen: false, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: true, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 12: Crane transfers sealed cover
  12: { idle: false, scanning: false, centerOpen: false, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: true, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 13: Waste stored in external unit
  13: { idle: false, scanning: false, centerOpen: false, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: true, craneRetract: false, returnToDock: false, charging: false, fullyCharged: false },
  // 14: Crane retracts
  14: { idle: false, scanning: false, centerOpen: false, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: true, returnToDock: false, charging: false, fullyCharged: false },
  // 15: Return to dock
  15: { idle: false, scanning: false, centerOpen: false, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: true, charging: false, fullyCharged: false },
  // 16: Charging
  16: { idle: false, scanning: false, centerOpen: false, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: true, fullyCharged: false },
  // 17: Fully charged
  17: { idle: false, scanning: false, centerOpen: false, justOpened: false, sliderEnter: false, sliderLocked: false, coverPlaced: false, careMode: false, washing: false, sliderRetrieve: false, sealing: false, sliderExit: false, centerClose: false, craneDeploy: false, craneTransfer: false, wasteStored: false, craneRetract: false, returnToDock: false, charging: false, fullyCharged: true },
};
