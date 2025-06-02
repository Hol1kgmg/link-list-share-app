import { Modifier } from '@dnd-kit/core';

export const restrictToListBounds: Modifier = ({
  transform,
  draggingNodeRect,
  containerNodeRect,
}) => {
  if (!draggingNodeRect || !containerNodeRect) {
    return transform;
  }

  const containerTop = containerNodeRect.top;
  const containerBottom = containerNodeRect.bottom;
  const itemHeight = draggingNodeRect.height;
  
  // ドラッグ中の要素の現在の位置
  const currentTop = draggingNodeRect.top + transform.y;
  const currentBottom = currentTop + itemHeight;
  
  // リストの境界を超えないように制限
  let restrictedY = transform.y;
  
  // 上端の制限
  if (currentTop < containerTop) {
    restrictedY = containerTop - draggingNodeRect.top;
  }
  
  // 下端の制限
  if (currentBottom > containerBottom) {
    restrictedY = containerBottom - draggingNodeRect.bottom;
  }
  
  return {
    ...transform,
    y: restrictedY,
    x: 0, // 横方向の移動も制限
  };
};