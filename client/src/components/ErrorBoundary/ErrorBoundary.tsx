import { Component } from 'react';

interface IErrorBoundaryProps extends React.HTMLAttributes<HTMLDivElement> {
  slotError?: React.ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
    return { hasError: true };
  }

  render() {
    const prettyError = <h2>Упс, произошла ошибка!</h2>;
    if (this.state.hasError) {
      return this.props.slotError ? this.props.slotError : prettyError;
    }

    return this.props.children;
  }
}
