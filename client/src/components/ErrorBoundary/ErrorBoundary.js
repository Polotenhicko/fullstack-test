import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
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
