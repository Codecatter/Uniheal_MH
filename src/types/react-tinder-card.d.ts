declare module "react-tinder-card" {
  import * as React from "react";

  export type Direction = "left" | "right" | "up" | "down";

  export interface TinderCardProps {
    onSwipe?: (direction: Direction) => void;
    onCardLeftScreen?: (identifier: string) => void;
    preventSwipe?: Direction[];
    className?: string;
    children?: React.ReactNode;
  }

  export default class TinderCard extends React.Component<TinderCardProps> {}
}
