import { useContext, useMemo } from 'react';
import { ElementDesignerContext } from '../context';

export function useElementMeasurements() {
  const { target } = useContext(ElementDesignerContext);

  return useMemo(() => {
    if (!target) {
      return null;
    }

    const style = getComputedStyle(target);

    return {
      marginTop: parseFloat(style.marginTop),
      marginBottom: parseFloat(style.marginBottom),
      marginLeft: parseFloat(style.marginLeft),
      marginRight: parseFloat(style.marginRight),
      paddingTop: parseFloat(style.paddingTop),
      paddingBottom: parseFloat(style.paddingBottom),
      paddingLeft: parseFloat(style.paddingLeft),
      paddingRight: parseFloat(style.paddingRight),
      borderTopWidth: parseFloat(style.borderTopWidth),
      borderBottomWidth: parseFloat(style.borderBottomWidth),
      borderLeftWidth: parseFloat(style.borderLeftWidth),
      borderRightWidth: parseFloat(style.borderRightWidth),
      width: target.clientWidth,
      height: target.clientHeight,
    };
  }, [target]);
}
