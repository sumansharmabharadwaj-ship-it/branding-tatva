"use client";

import { motion } from "framer-motion";

const COLORS = ["#C77752", "#6F9B95", "#D8A251", "#A7AF87", "#C08A9E"] as const;

const NODE_POSITIONS = [
  { x: 260, y: 46 },
  { x: 430, y: 164 },
  { x: 365, y: 342 },
  { x: 155, y: 342 },
  { x: 90, y: 164 },
] as const;

const FOUNDATION_LAYERS = [
  { y: 286, width: 368, label: "POSITION" },
  { y: 240, width: 320, label: "BELIEF" },
  { y: 194, width: 272, label: "AUDIENCE" },
  { y: 148, width: 224, label: "CATEGORY" },
] as const;

const FLOW_POINTS = [96, 178, 260, 342, 424] as const;
const FLOW_LABELS = ["DISCOVER", "ENTER", "CHOOSE", "RECEIVE", "RETURN"] as const;
const FLOW_POSITIONS = [194, 216, 202, 194, 192] as const;
const DISTINCTION_RAYS = Array.from({ length: 12 }, (_, index) => index * 30);
const VOICE_WAVES = [
  "M64 194 C108 112 152 276 196 194 C240 112 284 276 328 194 C372 112 416 276 456 194",
  "M64 194 C112 150 148 238 196 194 C244 150 280 238 328 194 C376 150 412 238 456 194",
  "M64 194 C116 174 144 214 196 194 C248 174 276 214 328 194 C380 174 408 214 456 194",
] as const;
const RECOGNITION_RINGS = [58, 94, 130, 166] as const;
const RECOGNITION_MARKS = [-116, -58, 0, 58, 116] as const;

type TatvaMechanismProps = {
  focusedIndex: number | null;
  motionActive: boolean;
};

function CompleteSystem({ motionActive }: Pick<TatvaMechanismProps, "motionActive">) {
  return (
    <svg viewBox="0 0 520 388" role="img" aria-label="Five Tatvas connected to one recognition system">
      <motion.path
        d="M260 46 L430 164 L365 342 L155 342 L90 164 Z"
        fill="rgba(244,239,230,0.025)"
        stroke="rgba(244,239,230,0.24)"
        strokeWidth="1.4"
        animate={motionActive ? { pathLength: [0.76, 1, 0.76], opacity: [0.46, 0.86, 0.46] } : undefined}
        transition={motionActive ? { duration: 9, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      {NODE_POSITIONS.map((node, index) => (
        <g key={`${node.x}-${node.y}`}>
          <motion.line
            x1={node.x}
            y1={node.y}
            x2="260"
            y2="204"
            stroke={COLORS[index]}
            strokeWidth="1.7"
            strokeDasharray="3 8"
            animate={motionActive ? { strokeDashoffset: [0, -44], opacity: [0.58, 0.92, 0.58] } : undefined}
            transition={motionActive ? { duration: 5.4 + index * 0.35, repeat: Infinity, ease: "linear" } : undefined}
          />
          <circle cx={node.x} cy={node.y} r="10" fill="#111A18" stroke={COLORS[index]} strokeWidth="2" />
          <circle cx={node.x} cy={node.y} r="3" fill={COLORS[index]} />
        </g>
      ))}
      <motion.circle
        cx="260"
        cy="204"
        r="64"
        fill="rgba(10,20,18,0.94)"
        stroke="#9CAF91"
        strokeWidth="1.6"
        animate={motionActive ? { r: [61, 67, 61], opacity: [0.84, 1, 0.84] } : undefined}
        transition={motionActive ? { duration: 5.8, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      <text x="260" y="198" textAnchor="middle" className="tatva-pressure-lab__svg-kicker tatva-pressure-lab__svg-core-kicker">
        COMPLETE
      </text>
      <text x="260" y="221" textAnchor="middle" className="tatva-pressure-lab__svg-title tatva-pressure-lab__svg-core-title">
        Recognition
      </text>
    </svg>
  );
}

function FoundationMechanism({ motionActive }: Pick<TatvaMechanismProps, "motionActive">) {
  return (
    <svg viewBox="0 0 520 388" role="img" aria-label="Prithvi builds four strategic layers into a stable foundation">
      <path d="M74 326 H446" stroke="rgba(244,239,230,0.18)" strokeWidth="1" />
      {FOUNDATION_LAYERS.map((layer, index) => (
        <motion.g
          key={layer.label}
          initial={false}
          animate={motionActive ? { y: [8, 0, 0], opacity: [0.45, 1, 1] } : { y: 0, opacity: 1 }}
          transition={motionActive ? { duration: 4.8, delay: index * 0.34, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" } : undefined}
        >
          <rect
            x={(520 - layer.width) / 2}
            y={layer.y}
            width={layer.width}
            height="34"
            rx="17"
            fill={`rgba(199,119,82,${0.1 + index * 0.035})`}
            stroke="rgba(199,119,82,0.68)"
          />
          <text x="260" y={layer.y + 22} textAnchor="middle" className="tatva-pressure-lab__svg-layer">
            {layer.label}
          </text>
        </motion.g>
      ))}
      <motion.path
        d="M260 54 V132"
        stroke="#C77752"
        strokeWidth="2"
        strokeDasharray="4 8"
        animate={motionActive ? { strokeDashoffset: [0, -36], opacity: [0.42, 1, 0.42] } : undefined}
        transition={motionActive ? { duration: 4.6, repeat: Infinity, ease: "linear" } : undefined}
      />
      <circle cx="260" cy="48" r="8" fill="#C77752" />
    </svg>
  );
}

function FlowMechanism({ motionActive }: Pick<TatvaMechanismProps, "motionActive">) {
  return (
    <svg viewBox="0 0 520 388" role="img" aria-label="Jal carries one coherent experience through five connected touchpoints">
      <path
        d="M72 210 C132 116 182 302 250 202 C318 102 366 288 448 178"
        fill="none"
        stroke="rgba(111,155,149,0.25)"
        strokeWidth="24"
        strokeLinecap="round"
      />
      <motion.path
        d="M72 210 C132 116 182 302 250 202 C318 102 366 288 448 178"
        fill="none"
        stroke="#6F9B95"
        strokeWidth="2.4"
        strokeLinecap="round"
        animate={motionActive ? { pathLength: [0.15, 1, 0.15], opacity: [0.46, 1, 0.46] } : undefined}
        transition={motionActive ? { duration: 7.8, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      {FLOW_POINTS.map((x, index) => (
        <g key={FLOW_LABELS[index]}>
          <motion.circle
            cx={x}
            cy={FLOW_POSITIONS[index]}
            r="11"
            fill="#111A18"
            stroke="#6F9B95"
            strokeWidth="2"
            animate={motionActive ? { r: [9, 13, 9] } : undefined}
            transition={motionActive ? { duration: 4.6, delay: index * 0.4, repeat: Infinity, ease: "easeInOut" } : undefined}
          />
          <text
            x={x}
            y={FLOW_POSITIONS[index] + (index % 2 === 0 ? 42 : -30)}
            textAnchor="middle"
            className="tatva-pressure-lab__svg-layer"
          >
            {FLOW_LABELS[index]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function DistinctionMechanism({ motionActive }: Pick<TatvaMechanismProps, "motionActive">) {
  return (
    <svg viewBox="0 0 520 388" role="img" aria-label="Agni concentrates strategic difference into distinctive brand cues">
      <g transform="translate(260 194)">
        {DISTINCTION_RAYS.map((rotation, index) => (
          <motion.line
            key={rotation}
            x1="0"
            y1="-62"
            x2="0"
            y2={index % 3 === 0 ? "-148" : "-116"}
            stroke={index % 3 === 0 ? "#D8A251" : "rgba(216,162,81,0.48)"}
            strokeWidth={index % 3 === 0 ? "2.4" : "1.2"}
            transform={`rotate(${rotation})`}
            animate={motionActive ? { opacity: [0.28, 1, 0.28], scaleY: [0.72, 1, 0.72] } : undefined}
            transition={motionActive ? { duration: 4.4, delay: index * 0.09, repeat: Infinity, ease: "easeInOut" } : undefined}
          />
        ))}
        <motion.path
          d="M0 -76 C42 -44 55 -12 42 22 C34 50 10 70 0 84 C-10 70 -34 50 -42 22 C-55 -12 -42 -44 0 -76 Z"
          fill="rgba(216,162,81,0.18)"
          stroke="#D8A251"
          strokeWidth="2"
          animate={motionActive ? { scale: [0.94, 1.05, 0.94], opacity: [0.78, 1, 0.78] } : undefined}
          transition={motionActive ? { duration: 4.8, repeat: Infinity, ease: "easeInOut" } : undefined}
        />
        <circle r="15" fill="#D8A251" />
      </g>
      <text x="260" y="372" textAnchor="middle" className="tatva-pressure-lab__svg-layer">
        ONE DIFFERENCE · MANY DISTINCTIVE CUES
      </text>
    </svg>
  );
}

function VoiceMechanism({ motionActive }: Pick<TatvaMechanismProps, "motionActive">) {
  return (
    <svg viewBox="0 0 520 388" role="img" aria-label="Vayu carries one verbal rhythm clearly through multiple channels">
      {VOICE_WAVES.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          fill="none"
          stroke={index === 0 ? "#A7AF87" : `rgba(167,175,135,${0.58 - index * 0.14})`}
          strokeWidth={2.4 - index * 0.45}
          animate={motionActive ? { pathLength: [0.18, 1, 0.18], opacity: [0.3, 1, 0.3] } : undefined}
          transition={motionActive ? { duration: 6.2 + index * 0.8, delay: index * 0.25, repeat: Infinity, ease: "easeInOut" } : undefined}
        />
      ))}
      <circle cx="64" cy="194" r="12" fill="#111A18" stroke="#A7AF87" strokeWidth="2" />
      <circle cx="456" cy="194" r="12" fill="#A7AF87" />
      <text x="64" y="244" textAnchor="middle" className="tatva-pressure-lab__svg-layer">VOICE</text>
      <text x="456" y="244" textAnchor="middle" className="tatva-pressure-lab__svg-layer">RECALL</text>
    </svg>
  );
}

function RecognitionMechanism({ motionActive }: Pick<TatvaMechanismProps, "motionActive">) {
  return (
    <svg viewBox="0 0 520 388" role="img" aria-label="Akash compounds consistent repetition into a familiar memory field">
      <g transform="translate(260 194)">
        {RECOGNITION_RINGS.map((radius, index) => (
          <motion.circle
            key={radius}
            r={radius}
            fill="none"
            stroke={index === 0 ? "#C08A9E" : `rgba(192,138,158,${0.52 - index * 0.07})`}
            strokeWidth={index === 0 ? "2.2" : "1.2"}
            strokeDasharray={index % 2 === 0 ? "4 9" : "2 12"}
            animate={motionActive ? { rotate: index % 2 === 0 ? 360 : -360, opacity: [0.36, 0.92, 0.36] } : undefined}
            transition={motionActive ? { duration: 14 + index * 3, repeat: Infinity, ease: "linear" } : undefined}
          />
        ))}
        {RECOGNITION_MARKS.map((x, index) => (
          <motion.circle
            key={x}
            cx={x}
            cy={index % 2 === 0 ? -18 : 18}
            r="8"
            fill={index === 2 ? "#C08A9E" : "#111A18"}
            stroke="#C08A9E"
            strokeWidth="1.8"
            animate={motionActive ? { scale: [0.82, 1.18, 0.82], opacity: [0.52, 1, 0.52] } : undefined}
            transition={motionActive ? { duration: 5.6, delay: index * 0.48, repeat: Infinity, ease: "easeInOut" } : undefined}
          />
        ))}
        <text x="0" y="7" textAnchor="middle" className="tatva-pressure-lab__svg-title">Familiar</text>
      </g>
    </svg>
  );
}

export function TatvaMechanism({ focusedIndex, motionActive }: TatvaMechanismProps) {
  switch (focusedIndex) {
    case 0:
      return <FoundationMechanism motionActive={motionActive} />;
    case 1:
      return <FlowMechanism motionActive={motionActive} />;
    case 2:
      return <DistinctionMechanism motionActive={motionActive} />;
    case 3:
      return <VoiceMechanism motionActive={motionActive} />;
    case 4:
      return <RecognitionMechanism motionActive={motionActive} />;
    default:
      return <CompleteSystem motionActive={motionActive} />;
  }
}
