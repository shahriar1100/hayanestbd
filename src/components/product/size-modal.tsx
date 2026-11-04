"use client";
import { Modal } from "@/components/ui/modal";
export function SizeModal({ open, onClose }: { open: boolean; onClose: () => void }) { return <Modal open={open} onClose={onClose} title="Size guide"><div className="size-table"><div><b>Size</b><b>Length</b><b>Best for</b></div><div><span>Standard</span><span>180 × 75 cm</span><span>Everyday hijabs</span></div><div><span>52</span><span>132 cm</span><span>Petite abaya</span></div><div><span>54</span><span>137 cm</span><span>Regular abaya</span></div><div><span>56</span><span>142 cm</span><span>Tall abaya</span></div></div></Modal>; }
