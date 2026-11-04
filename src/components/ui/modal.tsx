"use client";
import { X } from "lucide-react";
export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) { if (!open) return null; return <div className="modal-backdrop" onClick={onClose}><section className="modal-card" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}><header><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X /></button></header>{children}</section></div>; }
