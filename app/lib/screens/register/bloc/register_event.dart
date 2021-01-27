part of 'register_bloc.dart';

abstract class RegisterEvent extends Equatable {
  const RegisterEvent();

  List<Object> get props => [];
}

class RegisterStepChanged extends RegisterEvent {
  final RegisterStep step;
  const RegisterStepChanged(this.step);
  @override
  List<Object> get props => [step];
}

class RegisterFirstnameChanged extends RegisterEvent {
  final String firstname;
  const RegisterFirstnameChanged(this.firstname);
  @override
  List<Object> get props => [firstname];
}

class RegisterLastnameChanged extends RegisterEvent {
  final String lastname;
  const RegisterLastnameChanged(this.lastname);
  @override
  List<Object> get props => [lastname];
}