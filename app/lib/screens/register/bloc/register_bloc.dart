import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

part 'register_event.dart';
part 'register_state.dart';

enum RegisterStep { inputInfo, uploadPhoto, inputCredential }

class RegisterBloc extends Bloc<RegisterEvent, RegisterState> {
  RegisterBloc(RegisterState initialState) : super(initialState);


  @override
  Stream<RegisterState> mapEventToState(RegisterEvent event) {
    // TODO: implement mapEventToState
    throw UnimplementedError();
  }
}
